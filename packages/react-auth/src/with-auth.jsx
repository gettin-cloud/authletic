import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { AuthProvider } from '.';

export const withAuth = (SourceComponent) => {
  const C = ({ children, ...restProps }) => (
    <AuthProvider.Context.Consumer>
      {auth => (
        <SourceComponent auth={auth} {...restProps}>
          {children}
        </SourceComponent>
      )}
    </AuthProvider.Context.Consumer>
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
