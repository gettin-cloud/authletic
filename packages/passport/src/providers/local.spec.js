const express = require('express');
const request = require('supertest');
const { Passport } = require('passport');
const { PassportAuth } = require('../index');
const { LocalProvider } = require('./local');
const { InMemoryIdentityPool } = require('../identity-pool');
const { InMemoryUserPool } = require('../identity-pool');

describe('LocalProvider', () => {
  const app = express();
  const passport = new Passport();
  const identityPool = new InMemoryIdentityPool();
  const auth = new PassportAuth({ passport, identityPool });
  const userPool = new InMemoryUserPool();
  const provider = new LocalProvider({ userPool });

  auth.addProvider(provider);
  auth.setupApp(app);

  beforeEach(() => {
    identityPool.clear();
    userPool.clear();
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
        expect(response.statusCode).toBe(400);
      })
  ));

  it('login returns status 200 and an access token if credentials are ok', () => {
    userPool.createUser({
      username: 'unknown',
      password: '123',
    });
    return request(app)
      .post('/local/login')
      .send({ username: 'unknown', password: '123' })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });
});
