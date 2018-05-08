export class Auth {
  constructor(authOptions) {
    if (authOptions === undefined) {
      throw new Error('Options should be provided to create an Auth');
    }

    const { service } = authOptions;
    if (service === undefined) {
      throw new Error('The \'service\' option should be specified');
    }

    this.options = { ...authOptions };
    this.service = service;
    this.currentUser = undefined;
    this.providers = {};
  }

  addProvider(providerName, provider) {
    if (this.providers[providerName]) {
      throw new Error(`A provider with the '${providerName}' hame is already added.`);
    }
    this.providers[providerName] = provider;
  }

  getProvider(providerName) {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`The '${providerName}' is not registered. Use auth.addProvider() before.`);
    }
    return provider;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }

  signUp(providerName, options) {
    return this.getProvider(providerName).signUp(options);
  }

  login(providerName, options) {
    return this.getProvider(providerName).login(options);
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     const loggedUser = {
    //       username: 'test user',
    //     };
    //     this.currentUser = loggedUser;
    //     if (options.onStateChange) {
    //       options.onStateChange();
    //     }
    //     resolve(this.currentUser);
    //   }, 2000);
    // });
  }

  logout() {

  }

  getProfile(providerName, options) {
    return this.getProvider(providerName).getProfile(options);
  }
}
