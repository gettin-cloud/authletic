const { Auth } = require('./auth');
const { FormAuthProvider } = require('./providers/form-auth-provider');
const { InMemoryIdentityPool } = require('./identity-pool');
const { InMemoryUserPool } = require('./user-pool');

module.exports = {
  Auth,
  FormAuthProvider,
  InMemoryUserPool,
  InMemoryIdentityPool,
};
