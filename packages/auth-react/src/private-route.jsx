import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Redirect,
} from 'react-router-dom';

import { withAuth } from './';

const PrivateRoute = ({ auth, isAuthenticated, ...props }) => (
  isAuthenticated ?
    <Route {...props} /> :
    <Redirect to={{ pathname: auth.getLoginPath() }} />
);

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
};

export default withAuth(PrivateRoute);
