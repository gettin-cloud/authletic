const express = require('express');
const { Strategy: LocalStrategy } = require('passport-local');
const bodyParser = require('body-parser');

class LocalProvider {
  constructor(options) {
    this.options = {
      routePath: 'local',
      usernameField: 'email',
      passwordField: 'password',
      ...options,
    };
    if (!options.userPool) {
      throw new Error('The \'userPool\' option of LocalProvider is required');
    }
  }
  setupPassport(passport) {
    const { userPool, usernameField, passwordField } = this.options;
    passport.use(new LocalStrategy({
      usernameField,
      passwordField,
      session: false,
    }, (username, password, cb) => {
      userPool.users.findByUsername(username, (err, user) => {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password !== password) { return cb(null, false); }
        return cb(null, user);
      });
    }));
  }
  setupApp(app, passport) {
    const router = express.Router();
    const { routePath } = this.options;

    router.use(bodyParser.urlencoded({ extended: true }));

    router.post(
      `${routePath}/login`,
      (req, res, next) => {
        debugger;
        next();
      },
      passport.authenticate('local', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('/');
      },
    );

    router.get(
      `${routePath}/logout`,
      (req, res) => {
        req.logout();
        res.redirect('/');
      },
    );

    router.get(
      `${routePath}/profile`,
      // require('connect-ensure-login').ensureLoggedIn(),
      (req, res) => {
        res.render('profile', { user: req.user });
      },
    );

    app.use(`${routePath}/*`, router);
  }
}

module.exports = {
  LocalProvider,
};
