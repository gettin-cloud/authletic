const { LocalProvider } = require('./local');
const express = require('express');
const request = require('supertest');


describe('LocalProvider middleware', () => {
  const app = express();
  debugger;
  app.use(new LocalProvider().init());
  it('handles /register route', (done) => {
    request(app).get('/register').then((response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
});
