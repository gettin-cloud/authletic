const express = require('express');
const { Strategy: LocalStrategy } = require('passport-local');
const bodyParser = require('body-parser');

class LocalProvider {
  constructor(options) {
    this.options = {
      rootPath: '/local',
      usernameField: 'email',
      passwordField: 'password',
      ...options,
    };
    if (!options.userPool) {
      throw new Error('The \'userPool\' option of LocalProvider is required');
    }
  }
  setupPassport(passport) {
    const passportLogin = userPool => (username, password, cb) => {
      // userPool.find({ username }, (err, user) => {
      //   if (err) { return cb(err); }
      //   if (!user) { return cb(null, false); }
      //   if (user.password !== password) { return cb(null, false); }
      //   return cb(null, user);
      // });
      return cb(null, false);
    };

    const passportSignUp = userPool => (username, password, cb) => {
      // userPool.create({ username }, (err, user) => {
      //   if (err) { return cb(err); }
      //   if (!user) { return cb(null, false); }
      //   if (user.password !== password) { return cb(null, false); }
      //   return cb(null, user);
      // });
      return cb(null, false);
    };

    const { userPool, usernameField, passwordField } = this.options;

    const config = {
      usernameField,
      passwordField,
      session: false,
    };

    passport.use('local-login', new LocalStrategy(config, passportLogin(userPool)));
    passport.use('local-signup', new LocalStrategy(config, passportSignUp(userPool)));
  }
  setupApp(app, passport) {
    const router = express.Router();
    const { rootPath } = this.options;

    app.use(rootPath, router);

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    router.post(
      '/login',
      passport.authenticate('local-login'),
      (req, res, next, err) => {
        debugger;
        next();
      },
    );

    router.post(
      '/signup',
      passport.authenticate('local-signup'),
      (req, res, next, err) => {
        debugger;
        next();
      },
    );

    router.get(
      '/logout',
      (req, res) => {
        req.logout();
        res.redirect('/');
      },
    );

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
