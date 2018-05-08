const globalPassport = require('passport');
const jwt = require('jsonwebtoken');

const findIdentity = (identityPool, { jwtSecret }) => async (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    const { provider, userId, profile } = req.user;

    let identity = await identityPool.findIdentity({ provider, userId });
    // TODO find by email
    if (!identity) {
      identity = await identityPool.createIdentity({ provider, userId });
    }
    if (identity) {
      const accessToken = jwt.sign(
        { identityId: identity.id },
        jwtSecret,
        { expiresIn: '1h' },
      );
      const result = {
        accessToken,
        identityId: identity.id,
        profile,
      };
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    } else {
      res.status(401).send('Not authorized');
    }
  }
};

class PassportAuth {
  constructor(options) {
    if (!options.identityPool) {
      // TODO extract to a util
      throw new Error('The \'identityPool\' option should be specified');
    }
    if (!options.jwtSecret) {
      throw new Error('The \'jwtSecret\' option should be specified');
    }
    // passport
    // identityPool
    // jwtSecret
    this.options = {
      passport: globalPassport,
      ...options,
    };
    this.providers = [];
  }
  addProvider(provider) {
    this.providers.push(provider);
  }
  setupApp(app) {
    const { passport, identityPool } = this.options;

    this.providers.forEach((provider) => {
      provider.setupPassport(passport);
      provider.setupApp(app, passport);
    });

    app.use(findIdentity(identityPool, this.options));
  }
}

module.exports = {
  PassportAuth,
};
