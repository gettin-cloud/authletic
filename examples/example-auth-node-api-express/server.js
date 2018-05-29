const express = require('express');

const {
  FormAuthProvider,
  Auth,
  InMemoryIdentityPool,
  InMemoryUserPool,
} = require('@saasless/auth-node-api');

const app = express();

const userPool = new InMemoryUserPool();
const formAuthProvider = new FormAuthProvider({ userPool, jwtSecret: 'test' });

const identityPool = new InMemoryIdentityPool();
const auth = new Auth({ identityPool, jwtSecret: 'test' });

auth.use(formAuthProvider);

app.use('/', auth.api());

// app.use(express.static(path.join(__dirname, 'react-client/build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

console.log('Listening http://localhost:8080');
app.listen(process.env.PORT || 8080);
