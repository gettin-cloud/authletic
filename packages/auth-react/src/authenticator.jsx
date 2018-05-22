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
    this.onAuthStateChange = this.onAuthStateChange.bind(this);
  }
  componentDidMount() {
    this.auth.subscribe(this.onAuthStateChange);
  }
  componentWillReceiveProps(nextProps) {
    const { auth } = this;
    const { auth: nextAuth } = nextProps;

    if (auth !== nextAuth) {
      throw new Error('<Authenticator> does not support changing `auth` on the fly.');
    }
  }
  componentWillUnmount() {
    this.auth.unsubscribe(this.onAuthStateChange);
  }
  onAuthStateChange(e) {
    if (e.eventType === 'loggedIn' || e.eventType === 'loggedOut') {
      this.forceUpdate();
    }
  }
  render() {
    const { auth, children } = this.props;
    const contextValue = {
      auth,
      isAuthenticated: auth.isAuthenticated(),
    };
    return (
      <AuthContext.Provider value={contextValue}>
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
