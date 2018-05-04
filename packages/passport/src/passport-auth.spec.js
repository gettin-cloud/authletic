const globalPassport = require('passport');
const express = require('express');
const request = require('supertest');

const { PassportAuth } = require('./passport-auth');
const { InMemoryIdentityPool } = require('./identity-pool');

describe('PassportAuth', () => {
  let identityPool;
  let auth;
  let provider;
  let passport;

  beforeEach(() => {
    identityPool = new InMemoryIdentityPool();
    passport = new globalPassport.Passport();
    auth = new PassportAuth({ identityPool, passport, jwtSecret: 'test' });

    provider = {
      setupPassport: jest.fn(),
      setupApp: jest.fn(),
    };
  });

  it('throws if the \'identityPool\' option is not specified', () => {
    expect(() => new PassportAuth({ jwtSecret: 'test' })).toThrow();
  });

  it('throws if the \'jwtSecret\' option is not specified', () => {
    expect(() => new PassportAuth({ identityPool: {} })).toThrow();
  });

  it('#addProvider registers a provider', () => {
    expect(auth.providers.length).toBe(0);

    auth.addProvider(provider);
    expect(auth.providers.length).toBe(1);
  });

  describe('#setupApp', () => {
    beforeEach(() => {
      auth.addProvider(provider);
    });

    it('setups passport and app with each provider', () => {
      const app = express();

      expect(provider.setupPassport.mock.calls.length).toBe(0);
      expect(provider.setupApp.mock.calls.length).toBe(0);

      auth.setupApp(app);

      expect(provider.setupPassport.mock.calls.length).toBe(1);
      expect(provider.setupPassport.mock.calls[0][0]).toBe(passport);
      expect(provider.setupApp.mock.calls.length).toBe(1);
      expect(provider.setupApp.mock.calls[0][0]).toBe(app);
      expect(provider.setupApp.mock.calls[0][1]).toBe(passport);
    });

    describe('findIdentity middleware', () => {
      let app;
      let userInfo;
      beforeEach(() => {
        app = express();
        userInfo = {
          provider: 'test-provider',
          userId: 'test-id',
          profile: {
            customAttr: 'test-attr',
          },
        };

        app.get('/', (req, res, next) => {
          req.user = userInfo;
          next();
        });

        auth.setupApp(app);
      });

      it('returns status 401 if no identity is found', async () => {
        await request(app)
          .get('/')
          .send()
          .then((response) => {
            expect(response.statusCode).toBe(401);
          });
      });

      it('returns status 200 and identity info if an identity is found', async () => {
        const identity = await identityPool.createIdentity(userInfo);
        await request(app)
          .get('/')
          .send()
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body).toMatchObject({
              identityId: identity.id,
              profile: userInfo.profile,
            });
          });
      });
    });
  });
});
