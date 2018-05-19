import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const AuthContext = React.createContext();

class Authenticator extends PureComponent {
  constructor(props) {
    super(props);
    if (!props.auth) {
      throw new Error('The \'auth\' prop of an <Authenticator> should be specified');
    }
    this.auth = props.auth;
    this.auth.setNavigationHistory(props.history);
  }
  componentWillReceiveProps(nextProps) {
    const { auth } = this;
    const { auth: nextAuth } = nextProps;

    if (auth !== nextAuth) {
      throw new Error('<Authenticator> does not support changing `auth` on the fly.');
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
  history: PropTypes.object.isRequired,
};

Authenticator.defaultProps = {
  auth: undefined,
};

export default withRouter(Authenticator);
