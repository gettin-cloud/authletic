const { Auth } = require('./auth');
const { EmailProvider } = require('./providers/email-provider');
const { InMemoryIdentityPool } = require('./identity-pool');
const { InMemoryUserPool } = require('./user-pool');

module.exports = {
  Auth,
  EmailProvider,
  InMemoryUserPool,
  InMemoryIdentityPool,
};
