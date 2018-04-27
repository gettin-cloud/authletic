const { PassportAuth } = require('../index');
const { LocalProvider } = require('./local');
const express = require('express');
const request = require('supertest');
const globalPassport = require('passport');

describe('LocalProvider middleware', () => {
  const app = express();
  const passport = new globalPassport.Passport();
  const auth = new PassportAuth({ passport });
  const provider = new LocalProvider({ userPool: {} });

  auth.addProvider(provider);
  auth.setupApp(app);

  fit('handles /local/login route', (done) => {
    request(app)
      .post('/local/login')
      .send({ email: 'testuser', password: '123' })
      .then((response) => {
        debugger;
        expect(response.statusCode).toBe(200);
        done();
    });
  });
});
