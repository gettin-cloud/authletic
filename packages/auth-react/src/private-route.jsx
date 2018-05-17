import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import { withAuth } from './';

const PrivateRoute = ({ auth, component: Component, ...rest }) => {
  const { loginPath } = auth.options.routing;
  const render = (props) => {
    return auth.isAuthenticated() ? (<Component {...props} />) : (
      <Redirect
        to={{
          pathname: loginPath,
          state: { from: props.location }
        }}
      />
    );
  };
  return <Route {...rest} render={render} />;
};

export default withAuth(PrivateRoute);
