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

  it('handles local/login route', (done) => {
    request(app).post('local/login').then((response) => {
      debugger;
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
