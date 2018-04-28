const uuid = require('uuid/v1');
const { delegateTo } = require('./utils');

class IdentityPool {
  constructor(options) {
    this.options = {
      ...options,
    };
    if (!options.adapter) {
      throw new Error('The \'adapter\' option should be specified');
    }
    this.createIdentity = delegateTo(options.adapter, 'createIdentity');
    this.updateIdentity = delegateTo(options.adapter, 'updateIdentity');
    this.deleteIdentity = delegateTo(options.adapter, 'deleteIdentity');
  }
}

class InMemoryAdapter {
  constructor(options) {
    this.options = {
      newId: uuid,
      ...options,
    };
    this.identities = {};
  }
  clear() {
    this.identities = {};
  }
  createIdentity(login, meta) {
    return new Promise((resolve) => {
      const { newId } = this.options;
      const identityId = newId();
      const newIdentity = {
        id: identityId,
        logins: [
          login,
        ],
        meta,
      };
      this.identities[identityId] = newIdentity;
      resolve(newIdentity);
    });
  }
}

class InMemoryIdentityPool extends IdentityPool {
  constructor(options) {
    super({
      adapter: new InMemoryAdapter(),
      ...options,
    });
  }
}

module.exports = {
  IdentityPool,
  InMemoryIdentityPool,
  InMemoryAdapter,
};
