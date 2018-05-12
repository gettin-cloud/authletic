const express = require('express');
const { Passport } = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const nullEncrypt = password => password;

class LocalProvider {
  constructor(options) {
    // rootPath
    // usernameField
    // passwordField
    // encriptPassword
    // userPool
    // jwtSecret
    this.options = {
      rootPath: '/local',
      usernameField: 'username',
      passwordField: 'password',
      encryptPassword: nullEncrypt,
      ...options,
    };
    if (!options.userPool) {
      throw new Error('The \'userPool\' option of LocalProvider is required');
    }
    if (!options.jwtSecret) {
      throw new Error('The \'jwtSecret\' option of LocalProvider is required');
    }
    this.passport = new Passport();
    this.setupPassport(this.passport);
  }
  setupPassport(passport) {
    const {
      userPool,
      usernameField,
      passwordField,
      encryptPassword,
      jwtSecret,
    } = this.options;

    const removeSensitiveData = (user) => {
      const { [passwordField]: toRemove, ...rest } = user;
      return rest;
    };

    const passportLogin = (username, password, cb) => {
      userPool
        .findUser(username)
        .then((user) => {
          if (!user) {
            cb(null, false);
          }
          if (user.password !== encryptPassword(password)) {
            cb(null, false);
          }
          const accessToken = jwt.sign(
            {
              userId: user.id,
              username: user.username,
            },
            jwtSecret,
            { expiresIn: '1h' },
          );
          const userInfo = {
            provider: 'local',
            userId: user.id,
            username: user.username,
            profile: removeSensitiveData(user),
            accessToken,
          };
          cb(null, userInfo);
        })
        .catch(err => cb(err));
    };

    const passportSignUp = (username, password, cb) => {
      userPool
        .createUser({ username, password })
        .then((user) => {
          if (!user) {
            cb(null, false);
          }
          const accessToken = jwt.sign(
            {
              userId: user.id,
              username: user.username,
            },
            jwtSecret,
            { expiresIn: '1h' },
          );
          const userInfo = {
            provider: 'local',
            userId: user.id,
            username: user.username,
            profile: removeSensitiveData(user),
            accessToken,
          };
          cb(null, userInfo);
        })
        .catch(err => cb(err));
    };

    const getProfile = (jwtPayload, cb) => {
      const { username } = jwtPayload;
      userPool
        .findUser(username)
        .then((user) => {
          if (!user) {
            cb(null, false);
          } else {
            const profile = removeSensitiveData(user);
            cb(null, profile);
          }
        })
        .catch(err => cb(err));
    };

    const localConfig = {
      usernameField,
      passwordField,
      session: false,
    };

    passport.use('local-login', new LocalStrategy(localConfig, passportLogin));
    passport.use('local-signup', new LocalStrategy(localConfig, passportSignUp));

    const jwtConfig = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      session: false,
    };

    passport.use('jwt', new JwtStrategy(jwtConfig, getProfile));
  }
  rootPath() {
    return this.options.rootPath;
  }
  router() {
    const router = express.Router();
    //const { rootPath } = this.options;

    //app.use(rootPath, router);

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    router.post(
      '/login',
      this.passport.authenticate('local-login', { session: false }),
    );

    router.post(
      '/signup',
      this.passport.authenticate('local-signup', { session: false }),
    );

    router.get(
      '/profile',
      this.passport.authenticate('jwt', { session: false }),
      (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(req.user));
      },
    );

    return router;
  }
}

module.exports = {
  LocalProvider,
};
