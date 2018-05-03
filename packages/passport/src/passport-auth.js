const globalPassport = require('passport');
const jwt = require('jsonwebtoken');

const createAccessToken = ({ userId, expiresInMinutes }, secret) => {
  const exp = Math.floor(Date.now() / 1000) + (expiresInMinutes * 60);
  return jwt.sign({
    userId,
    exp,
  }, secret);
};

const findIdentity = identityPool => async (req, res, next) => {
  if (!req.user) {
    next();
  }

  const { provider, userId, profile } = req.user;

  const identity = await identityPool.findIdentity({ provider, userId });
  if (identity) {
    // TODO
    const accessToken = createAccessToken({ identityId: identity.id, expiresInMinutes: 60 }, 'secret');
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
};

class PassportAuth {
  constructor(options) {
    if (!options.identityPool) {
      throw new Error('The \'identityPool\' option should be specified');
    }
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

    app.use(findIdentity(identityPool));
  }
}

module.exports = {
  PassportAuth,
};
