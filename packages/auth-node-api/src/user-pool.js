const { delegateTo } = require('./utils');

class UserPool {
  constructor(options) {
    this.options = {
      ...options,
    };
    if (!options.adapter) {
      throw new Error('The \'adapter\' option should be specified');
    }
    this.createUser = delegateTo(options.adapter, 'createUser');
    this.updateUser = delegateTo(options.adapter, 'updateUser');
    this.deleteUser = delegateTo(options.adapter, 'deleteUser');
    this.findUser = delegateTo(options.adapter, 'findUser');
  }
}

class InMemoryAdapter {
  constructor(options) {
    this.options = {
      ...options,
    };
    this.users = {};
  }
  clear() {
    this.users = {};
  }
  findUser(email) {
    return new Promise((resolve) => {
      resolve(this.users[email]);
    });
  }
  createUser(user) {
    return new Promise((resolve) => {
      const newUser = {
        id: user.email,
        ...user,
      };
      if (this.users[user.email]) {
        throw new Error(`User with '${user.email}' email already exists`);
      }
      this.users[user.email] = newUser;
      resolve(newUser);
    });
  }
}

class InMemoryUserPool extends UserPool {
  constructor(options) {
    super({
      adapter: new InMemoryAdapter(),
      ...options,
    });
  }
}

module.exports = {
  UserPool,
  InMemoryUserPool,
  InMemoryAdapter,
};
