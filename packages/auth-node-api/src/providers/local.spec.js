const express = require('express');
const request = require('supertest');

const { LocalProvider } = require('./local');
const {
  UserPool,
  InMemoryAdapter: UserPoolAdapter,
} = require('../user-pool');

describe('LocalProvider', () => {
  const app = express();

  const userPoolAdapter = new UserPoolAdapter();
  const userPool = new UserPool({ adapter: userPoolAdapter });
  const provider = new LocalProvider({ userPool, jwtSecret: 'test' });

  app.use(provider.api());

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

  describe('login', () => {
    it('returns status 400 if a username is not provided', async () => {
      await request(app)
        .post('/login')
        .send({ password: '123' })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        });
    });

    it('returns status 400 if a password is not provided', async () => {
      await request(app)
        .post('/login')
        .send({ username: 'testuser' })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        });
    });

    it('returns status 401 if a user is not found', async () => {
      await request(app)
        .post('/login')
        .send({ username: 'testuser', password: '123' })
        .then((response) => {
          expect(response.statusCode).toBe(401);
        });
    });

    it('puts login info into req if credentials are ok', async () => {
      const userInfo = {
        username: 'testuser',
        password: '123',
      };

      await userPool.createUser(userInfo);
      await request(app)
        .post('/login')
        .send(userInfo)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body.accessToken).toBeDefined();
          expect(response.body).toMatchObject({
            provider: 'local',
            userId: 'testuser',
            profile: {
              id: 'testuser',
              username: 'testuser',
            },
          });
        });
    });
  });

  describe('signup', () => {
    it('returns status 400 if a username is not provided', async () => {
      await request(app)
        .post('/signup')
        .send({ password: '123' })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        });
    });

    it('returns status 400 if a password is not provided', async () => {
      await request(app)
        .post('/signup')
        .send({ username: 'testuser' })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        });
    });

    // TODO: sign up if a user doesn't exist
    // it('returns status 401 if a user is not found', async () => {
    //   await request(app)
    //     .post('/signup')
    //     .send({ username: 'testuser', password: '123' })
    //     .then((response) => {
    //       expect(response.statusCode).toBe(401);
    //     });
    // });

    // TODO: sign up if a user exists
    // it('puts login info into req if credentials are ok', async () => {
    //   const userInfo = {
    //     username: 'testuser',
    //     password: '123',
    //   };

    //   await userPool.createUser(userInfo);
    //   await request(app)
    //     .post('/signup')
    //     .send(userInfo)
    //     .then((response) => {
    //       expect(response.statusCode).toBe(200);
    //       expect(response.body.accessToken).toBeDefined();
    //       expect(response.body).toMatchObject({
    //         provider: 'local',
    //         userId: 'testuser',
    //         profile: {
    //           id: 'testuser',
    //           username: 'testuser',
    //         },
    //       });
    //     });
    // });
  });

  describe('profile', () => {
    it('returns status 401 if accessToken is not provided', async () => {
      await request(app)
        .get('/profile')
        .send()
        .then((response) => {
          expect(response.statusCode).toBe(401);
          expect(response.body).toBeDefined();
          expect(Object.keys(response.body).length).toBe(0);
        });
    });

    it('returns status 401 if accessToken is not valid', async () => {
      await request(app)
        .get('/profile')
        .set('Authorization', 'bearer invalid')
        .send()
        .then((response) => {
          expect(response.statusCode).toBe(401);
          expect(response.body).toBeDefined();
          expect(Object.keys(response.body).length).toBe(0);
        });
    });

    it('returns status 200 and profile data if accessToken is valid', async () => {
      const userInfo = {
        username: 'testuser',
        password: '123',
      };

      const { password, ...user } = await userPool.createUser(userInfo);

      let res;
      await request(app)
        .post('/login')
        .send(userInfo)
        .then((response) => {
          expect(response.statusCode).toBe(200);
          res = response;
        });

      const { accessToken } = res.body;
      expect(accessToken).toBeDefined();

      await request(app)
        .get('/profile')
        .set('Authorization', `bearer ${accessToken}`)
        .send()
        .then((response) => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(user);
        });
    });
  });
});
