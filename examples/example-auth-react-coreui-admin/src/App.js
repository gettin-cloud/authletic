import React, { Component } from 'react';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';

import { Auth } from '@saasless/auth-client';
import { Authenticator } from '@saasless/auth-react';
import { PrivateRoute } from '@saasless/auth-react-router';

import './App.css';
// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
// import '../node_modules/@coreui/styles/scss/_dropdown-menu-right.scss';

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';
import { create } from 'domain';

// import { renderRoutes } from 'react-router-config';

const auth = new Auth({ service: {}});
auth.addProvider('email', {
  login: (options) => {
    console.log(options);
    return Promise.resolve({ user: 'AAA' });
  }
});
//auth.login();

PrivateRoute.configure({ loginPath: '/login' });

class App extends Component {
  render() {
    return (
      <Authenticator auth={auth}>
        <HashRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <PrivateRoute path="/" name="Home" component={DefaultLayout} />
          </Switch>
        </HashRouter>
      </Authenticator>
    );
  }
}

export default App;
