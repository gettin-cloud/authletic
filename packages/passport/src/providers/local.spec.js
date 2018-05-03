const express = require('express');
const request = require('supertest');
const { Passport } = require('passport');
const { PassportAuth } = require('../index');
const { LocalProvider } = require('./local');
const {
  IdentityPool,
  InMemoryAdapter: IdentityPoolAdapter,
} = require('../identity-pool');
const {
  UserPool,
  InMemoryAdapter: UserPoolAdapter,
} = require('../user-pool');

describe('LocalProvider', () => {
  const app = express();
  const passport = new Passport();

  const identityPoolAdapter = new IdentityPoolAdapter();
  const identityPool = new IdentityPool({ adapter: identityPoolAdapter });
  const auth = new PassportAuth({ passport, identityPool });

  const userPoolAdapter = new UserPoolAdapter();
  const userPool = new UserPool({ adapter: userPoolAdapter });
  const provider = new LocalProvider({ userPool });

  auth.addProvider(provider);
  auth.setupApp(app);

  beforeEach(() => {
    identityPoolAdapter.clear();
    userPoolAdapter.clear();
  });

  it('login returns status 400 if a username is not provided', () => (
    request(app)
      .post('/local/login')
      .send({ password: '123' })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      })
  ));

  it('login returns status 400 if a password is not provided', () => (
    request(app)
      .post('/local/login')
      .send({ username: 'testuser' })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      })
  ));

  it('login returns status 401 if a user is not found', () => (
    request(app)
      .post('/local/login')
      .send({ username: 'unknown', password: '123' })
      .then((response) => {
        expect(response.statusCode).toBe(401);
      })
  ));

  it('login returns status 200 and an access token if credentials are ok', async () => {
    const userInfo = {
      username: 'unknown',
      password: '123',
    };
    const user = await userPool.createUser(userInfo);
    const meta = { username: 'unknown' };
    const identity = await identityPool.createIdentity({
      provider: 'local',
      userId: user.id,
    }, meta);

    return request(app)
      .post('/local/login')
      .send(user)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.identityId).toBe(identity.id);
        expect(response.body.profile).toEqual({
          id: 'unknown',
          username: 'unknown',
        });
      });
  });
});
