const { PassportAuth } = require('./passport-auth');
const { LocalProvider } = require('./providers/local');
const { InMemoryIdentityPool } = require('./identity-pool');
const { InMemoryUserPool } = require('./user-pool');

module.exports = {
  PassportAuth,
  LocalProvider,
  InMemoryUserPool,
  InMemoryIdentityPool,
};
