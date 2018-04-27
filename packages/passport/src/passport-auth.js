const globalPassport = require('passport');

class PassportAuth {
  constructor(options) {
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
    const { passport } = this.options;

    this.providers.forEach((provider) => {
      provider.setupPassport(passport);
      provider.setupApp(app, passport);
    });

    app.use(passport.initialize());
  }
}

module.exports = {
  PassportAuth,
};
