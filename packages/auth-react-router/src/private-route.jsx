import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import { withAuth } from '@saasless/auth-react';

let config = {
  loginPath: '/login',
};

const PrivateRoute = ({ auth, component: Component, ...rest }) => {
  const render = (props) => {
    return auth.isAuthenticated() ? (<Component {...props} />) : (
      <Redirect
        to={{
          pathname: config.loginPath,
          state: { from: props.location }
        }}
      />
    );
  };
  return <Route {...rest} render={render} />;
};

PrivateRoute.configure = (options) => {
  config = { ...config, options };
};

export default withAuth(PrivateRoute);
