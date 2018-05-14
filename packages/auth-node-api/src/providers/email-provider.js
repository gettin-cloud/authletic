const express = require('express');
const { Passport } = require('passport');
const { Strategy: EmailStrategy } = require('passport-local');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const nullEncrypt = password => password;

class EmailProvider {
  constructor(options) {
    // rootPath
    // emailField
    // passwordField
    // encriptPassword
    // userPool
    // jwtSecret
    this.options = {
      rootPath: '/email',
      emailField: 'email',
      passwordField: 'password',
      encryptPassword: nullEncrypt,
      ...options,
    };
    if (!options.userPool) {
      throw new Error('The \'userPool\' option of EmailProvider is required');
    }
    if (!options.jwtSecret) {
      throw new Error('The \'jwtSecret\' option of EmailProvider is required');
    }
    this.passport = new Passport();
    this.setupPassport(this.passport);
  }
  setupPassport(passport) {
    const {
      userPool,
      emailField,
      passwordField,
      encryptPassword,
      jwtSecret,
    } = this.options;

    const removeSensitiveData = (user) => {
      const { [passwordField]: toRemove, ...rest } = user;
      return rest;
    };

    const passportLogin = (email, password, cb) => {
      userPool
        .findUser(email)
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
              userEmail: user.email,
            },
            jwtSecret,
            { expiresIn: '1h' },
          );
          const userInfo = {
            provider: 'email',
            userId: user.id,
            userEmail: user.email,
            profile: removeSensitiveData(user),
            accessToken,
          };
          cb(null, userInfo);
        })
        .catch(err => cb(err));
    };

    const passportSignUp = (email, password, cb) => {
      userPool
        .createUser({ email, password })
        .then((user) => {
          if (!user) {
            cb(null, false);
          }
          const accessToken = jwt.sign(
            {
              userId: user.id,
              userEmail: user.email,
            },
            jwtSecret,
            { expiresIn: '1h' },
          );
          const userInfo = {
            provider: 'email',
            userId: user.id,
            userEmail: user.email,
            profile: removeSensitiveData(user),
            accessToken,
          };
          cb(null, userInfo);
        })
        .catch(err => cb(err));
    };

    const getProfile = (jwtPayload, cb) => {
      const { userEmail } = jwtPayload;
      userPool
        .findUser(userEmail)
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

    const emailStrategyConfig = {
      usernameField: emailField,
      passwordField,
      session: false,
    };

    passport.use('email-login', new EmailStrategy(emailStrategyConfig, passportLogin));
    passport.use('email-signup', new EmailStrategy(emailStrategyConfig, passportSignUp));

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
  api() {
    const router = express.Router();

    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));

    router.post(
      '/login',
      this.passport.authenticate('email-login', { session: false }),
    );

    router.post(
      '/signup',
      this.passport.authenticate('email-signup', { session: false }),
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
  EmailProvider,
};
