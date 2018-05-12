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
    this.adapter = options.adapter;
    this.createIdentity = delegateTo(options.adapter, 'createIdentity');
    this.updateIdentity = delegateTo(options.adapter, 'updateIdentity');
    this.deleteIdentity = delegateTo(options.adapter, 'deleteIdentity');
    this.linkIdentities = delegateTo(options.adapter, 'linkIdentities');
  }
  findIdentity(login) {
    if (!login || !login.provider || !login.userId) {
      throw new Error('The \'findIdentity\' method accepts a login object as { provider: \'...\', userId: \'...\' }');
    }
    return this.adapter.findIdentity(login);
  }
}

class InMemoryAdapter {
  constructor(options) {
    this.options = {
      newId: uuid,
      ...options,
    };
    this.identities = [];
  }
  clear() {
    this.identities = [];
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
      this.identities.push(newIdentity);
      resolve(newIdentity);
    });
  }
  findIdentity(login) {
    const findLogin = l => l.provider === login.provider && l.userId === login.userId;
    return new Promise((resolve) => {
      const match = this.identities
        .filter(id => id.logins.filter(findLogin).length)[0];
      resolve(match);
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
