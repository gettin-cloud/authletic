const uuid = require('uuid/v1');

function delegateTo(target, method) {
  return (...args) => (target[method](...args));
}

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
  constructor() {
    this.identities = {};
  }
  createIdentity(login, meta) {
    const identityId = uuid();
    this.identities[identityId] = {
      id: identityId,
      logins: [
        login,
      ],
      meta,
    };
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
};
