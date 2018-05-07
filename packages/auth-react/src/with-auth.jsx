import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { Authenticator } from '.';

export const withAuth = (SourceComponent) => {
  const C = ({ children, ...restProps }) => (
    <Authenticator.Context.Consumer>
      {auth => (
        <SourceComponent auth={auth} {...restProps}>
          {children}
        </SourceComponent>
      )}
    </Authenticator.Context.Consumer>
  );

  C.displayName = `withAuth(${SourceComponent.displayName || SourceComponent.name})`;

  C.propTypes = {
    children: PropTypes.any,
  };

  C.defaultProps = {
    children: undefined,
  };

  return hoistStatics(C, SourceComponent);
};
