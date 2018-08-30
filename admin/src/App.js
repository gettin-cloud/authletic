import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import { Auth, MockAuthProvider } from '@saasless/auth-client';
import { Authenticator, PrivateRoute } from '@saasless/auth-react';


import Layout from './pages/layout';
import Login from './pages/login';

const auth = new Auth({
  service: {},
  routing: {
    loginPath: '/login',
  },
});


const fakeLogin = (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.email !== '123' ) {
        reject(new Error('User not found. Use 123'))
      }
      else {
        resolve({ userName: 'test' });
      };
    }, 1000);
  });
};
const mockAuthProvider = new MockAuthProvider({ login: fakeLogin});

auth.addProvider('form', mockAuthProvider);
//auth.login();

//PrivateRoute.configure({ loginPath: '/login' });

class App extends Component {
  render() {
    return (
      <Router>
        <Authenticator auth={auth}>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            {/* <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} /> */}
            <PrivateRoute path="/" name="Home" component={Layout} />
          </Switch>
        </Authenticator>
      </Router>
    );
  }
}

export default App;
