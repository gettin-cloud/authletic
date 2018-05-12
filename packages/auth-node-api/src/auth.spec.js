const globalPassport = require('passport');
const express = require('express');
const request = require('supertest');

const { Auth } = require('./auth');
const { InMemoryIdentityPool } = require('./identity-pool');

describe('Auth', () => {
  let identityPool;
  let auth;
  let provider;
  let passport;

  beforeEach(() => {
    identityPool = new InMemoryIdentityPool();
    passport = new globalPassport.Passport();
    auth = new Auth({ identityPool, passport, jwtSecret: 'test' });

    provider = {
      api: jest.fn().mockImplementation(() => ((req, res, next) => next())),
      rootPath: jest.fn().mockImplementation(() => '/'),
    };
  });

  it('throws if the \'identityPool\' option is not specified', () => {
    expect(() => new Auth({ jwtSecret: 'test' })).toThrow();
  });

  it('throws if the \'jwtSecret\' option is not specified', () => {
    expect(() => new Auth({ identityPool: {} })).toThrow();
  });

  it('#use registers a provider', () => {
    expect(auth.providers.length).toBe(0);

    auth.use(provider);
    expect(auth.providers.length).toBe(1);
  });

  describe('#setupApp', () => {
    beforeEach(() => {
      auth.use(provider);
    });

    it('setups passport and app with each provider', () => {
      const app = express();

      app.use('/', auth.api());
      expect(provider.api.mock.calls.length).toBe(1);
      expect(provider.rootPath.mock.calls.length).toBe(1);
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
          req.user = userInfo; // Emulate auth succeeded
          next();
        });

        app.use('/', auth.api());
      });

      it('creates identity if no identity is found and a user exists', async () => {
        expect(identityPool.adapter.identities).toHaveLength(0);
        await request(app)
          .get('/')
          .send()
          .then((response) => {
            expect(response.statusCode).toBe(200);
            expect(identityPool.adapter.identities).toHaveLength(1);
            expect(identityPool.adapter.identities[0]).toMatchObject({
              logins: [
                {
                  provider: 'test-provider',
                  userId: 'test-id',
                },
              ],
              meta: undefined,
            });
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
