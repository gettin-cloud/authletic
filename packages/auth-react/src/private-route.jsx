import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import { withAuth } from './';

const PrivateRoute = ({ auth, component: Component, ...rest }) => {
  const { loginPath } = auth.options.routing;
  const render = (props) => {
    const { location } = props;
    return auth.isAuthenticated() ? (<Component {...props} />) : (
      <Redirect
        to={{
          pathname: loginPath,
          state: { from: location },
        }}
      />
    );
  };
  return <Route {...rest} render={render} />;
};

PrivateRoute.propTypes = {
  location: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
};

export default withAuth(PrivateRoute);
