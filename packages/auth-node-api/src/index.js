const { Auth } = require('./auth');
const { LocalProvider } = require('./providers/local');
const { InMemoryIdentityPool } = require('./identity-pool');
const { InMemoryUserPool } = require('./user-pool');

module.exports = {
  Auth,
  LocalProvider,
  InMemoryUserPool,
  InMemoryIdentityPool,
};
