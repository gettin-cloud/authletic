const express = require('express');

const {
  LocalProvider,
  PassportAuth,
  InMemoryIdentityPool,
  InMemoryUserPool,
} = require('@saasless/auth-node-api');

const app = express();

const userPool = new InMemoryUserPool();
const localProvider = new LocalProvider({ userPool, jwtSecret: 'test' });

const identityPool = new InMemoryIdentityPool();
const auth = new PassportAuth({ identityPool, jwtSecret: 'test' });

auth.addProvider(localProvider);

auth.setupApp(app);

// provider.setupPassport(passport);
// provider.setupApp(app, passport);

// app.use(express.static(path.join(__dirname, 'react-client/build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

console.log('Listening http://localhost:8080');
app.listen(process.env.PORT || 8080);
