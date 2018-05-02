const express = require('express');
const { Strategy: LocalStrategy } = require('passport-local');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const nullEncrypt = password => password;

const createAccessToken = ({ userId, expiresInMinutes }, secret) => {
  const exp = Math.floor(Date.now() / 1000) + (expiresInMinutes * 60);
  return jwt.sign({
    userId,
    exp,
  }, secret);
};

class LocalProvider {
  constructor(options) {
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
  }
  setupPassport(passport) {
    const {
      userPool,
      usernameField,
      passwordField,
      encryptPassword,
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
            return cb(null, false);
          }
          if (user.password !== encryptPassword(password)) {
            return cb(null, false);
          }
          return cb(null, removeSensitiveData(user));
        })
        .catch(err => cb(err));
    };

    const passportSignUp = (username, password, cb) => {
      userPool.create({ username }, (err, user) => {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password !== password) { return cb(null, false); }
        return cb(null, removeSensitiveData(user));
      });
      return cb(null, false);
    };

    const config = {
      usernameField,
      passwordField,
      session: false,
    };

    passport.use('local-login', new LocalStrategy(config, passportLogin));
    passport.use('local-signup', new LocalStrategy(config, passportSignUp));
  }
  setupApp(app, passport) {
    const router = express.Router();
    const { rootPath } = this.options;

    app.use(passport.initialize());
    app.use(rootPath, router);

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    router.post(
      '/login',
      passport.authenticate('local-login', { session: false }),
      (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        //console.log()
        const accessToken = createAccessToken({ userId: req.user.username, expiresInMinutes: 60 }, 'secret');
        res.send(JSON.stringify({
          accessToken,
        }));
      },
    );

    router.post(
      '/signup',
      passport.authenticate('local-signup', { session: false }),
      (req, res) => {
        debugger;
      },
    );

    // Server-side logout doesn't make sense for SPA apps
    // router.get(
    //   '/logout',
    //   (req, res) => {
    //     req.logout();
    //     res.redirect('/');
    //   },
    // );

    router.get(
      '/profile',
      // require('connect-ensure-login').ensureLoggedIn(),
      (req, res) => {
        res.send(JSON.stringify({ user: req.user }));
      },
    );
  }
}

module.exports = {
  LocalProvider,
};
