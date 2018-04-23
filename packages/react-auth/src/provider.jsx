import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext();

class AuthProvider extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.auth) {
      throw new Error('The \'auth\' prop of an <AuthProvider> should be specified');
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

AuthProvider.Context = AuthContext;

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node).isRequired,
    PropTypes.node.isRequired,
  ]).isRequired,
  auth: PropTypes.shape({
    isAuthenticated: PropTypes.bool,
    user: PropTypes.shape({
      displayName: PropTypes.string,
    }),
    login: PropTypes.func,
    logout: PropTypes.func,
    getProfile: PropTypes.func,
  }),
};

AuthProvider.defaultProps = {
  auth: undefined,
};

export default AuthProvider;
