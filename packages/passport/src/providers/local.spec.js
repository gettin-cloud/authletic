const express = require('express');
const request = require('supertest');

const { Passport } = require('passport');
const { LocalProvider } = require('./local');
const {
  UserPool,
  InMemoryAdapter: UserPoolAdapter,
} = require('../user-pool');

describe('LocalProvider', () => {
  const app = express();
  const passport = new Passport();

  const userPoolAdapter = new UserPoolAdapter();
  const userPool = new UserPool({ adapter: userPoolAdapter });
  const provider = new LocalProvider({ userPool });

  provider.setupPassport(passport);
  provider.setupApp(app, passport);

  const testOutput = (req, res, next) => {
    if (req.user) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(req.user));
    } else {
      next();
    }
  };

  app.use(testOutput);

  beforeEach(() => {
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

  it('login puts user info into req if credentials are ok', async () => {
    const userInfo = {
      username: 'unknown',
      password: '123',
    };

    const user = await userPool.createUser(userInfo);
    return request(app)
      .post('/local/login')
      .send(user)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
          provider: 'local',
          userId: 'unknown',
          profile: {
            id: 'unknown',
            username: 'unknown',
          },
        });
      });
  });
});
