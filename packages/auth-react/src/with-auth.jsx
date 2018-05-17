import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { Authenticator } from '.';

class ConnectAuth extends PureComponent {
  constructor(props) {
    super(props);
    this.auth = props.auth;
    this.onAuthStateChange = this.onAuthStateChange.bind(this);
  }
  componentDidMount() {
    this.auth.subscribe(this.onAuthStateChange);
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
    const { auth, children: element } = this.props;
    return React.cloneElement(
      element,
      {
        auth,
        isAuthenticated: auth.isAuthenticated(),
      },
    );
  }
}

ConnectAuth.propTypes = {
  children: PropTypes.any,
};

ConnectAuth.defaultProps = {
  children: undefined,
};


export const withAuth = (WrappedComponent) => {
  const C = ({ children, ...restProps }) => (
    <Authenticator.Context.Consumer>
      {auth => (
        <ConnectAuth auth={auth}>
          <WrappedComponent {...restProps}>
            {children}
          </WrappedComponent>
        </ConnectAuth>
      )}
    </Authenticator.Context.Consumer>
  );

  C.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  C.propTypes = {
    children: PropTypes.any,
  };

  C.defaultProps = {
    children: undefined,
  };

  return hoistStatics(C, WrappedComponent);
};
