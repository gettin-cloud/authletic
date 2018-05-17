/* */

import { InMemoryStore } from './client-store';


function notifySubscribers(eventType, eventData) {
  this.listeners.forEach(l => l({ eventType, eventData }));
}

export class Auth {
  constructor(authOptions) {
    if (authOptions === undefined) {
      throw new Error('Options should be provided to create an Auth');
    }

    const { service, sessionStore } = authOptions;
    if (service === undefined) {
      // throw new Error('The \'service\' option should be specified');
    }

    this.options = {
      routing: {
        loginPath: '/login',
        defaultPath: '/',
        ...authOptions.routing,
      },
      ...authOptions,
    };
    this.service = service;
    this.sessionStore = sessionStore || (window && window.localStorage
      ? window.localStorage
      : new InMemoryStore());
    this.currentUser = undefined;
    this.sessionStoreKey = `${this.options.appName || 'Auth'}_credentials`;
    this.providers = {};
    this.listeners = [];
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('An Auth listener should be a function');
    }
    this.listeners.push(listener);
  }

  unsubscribe(listener) {
    const newListeners = this.listeners.filter(l => l !== listener);
    this.listeners.length = 0;
    this.listeners.push(...newListeners);
  }

  addProvider(providerName, provider) {
    if (this.providers[providerName]) {
      throw new Error(`A provider with the '${providerName}' hame is already added.`);
    }
    this.providers[providerName] = provider;
  }

  setNavigationHistory(history) {
    this.history = history;
  }

  getProvider(providerName) {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`The '${providerName}' provider is not registered. Use auth.addProvider() before.`);
    }
    return provider;
  }

  isAuthenticated() {
    return !!this.sessionStore.getItem(this.sessionStoreKey);
  }

  getUser() {
    return this.currentUser;
  }

  signUp(providerName, options) {
    return this.getProvider(providerName).signUp(options);
  }

  login(providerName, options) {
    const provider = this.getProvider(providerName);
    return new Promise((resolve, reject) => {
      provider
        .login(options)
        .then((credentials) => {
          this.sessionStore.setItem(this.sessionStoreKey, JSON.stringify(credentials));
          notifySubscribers.call(this, 'loggedIn', credentials);
          resolve(credentials);
        })
        .catch(reject);
    });
  }

  logout() {
    this.sessionStore.removeItem(this.sessionStoreKey);
    notifySubscribers.call(this, 'loggedOut');
    return Promise.resolve();
  }

  getProfile(providerName, options) {
    return this.getProvider(providerName).getProfile(options);
  }
}
