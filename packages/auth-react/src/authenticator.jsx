import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext();

export class Authenticator extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.auth) {
      throw new Error('The \'auth\' prop of an <Authenticator> should be specified');
    }
  }
  render() {
    const { auth, children } = this.props;
    return (
      <AuthContext.Provider value={auth}>
        {children}
      </AuthContext.Provider>
    );
  }
}

Authenticator.Context = AuthContext;

Authenticator.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node).isRequired,
    PropTypes.node.isRequired,
  ]).isRequired,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.func,
    user: PropTypes.shape({
      displayName: PropTypes.string,
    }),
    login: PropTypes.func,
    logout: PropTypes.func,
    getProfile: PropTypes.func,
  }),
};

Authenticator.defaultProps = {
  auth: undefined,
};

