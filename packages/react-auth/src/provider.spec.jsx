import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { AuthProvider } from './index';

describe('A <AuthProvider>', () => {
  const node = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  describe('without an auth provided', () => {
    it('throws an error', () => {
      spyOn(console, 'error');

      expect(() => {
        ReactDOM.render(
          <AuthProvider>
            <div />
          </AuthProvider>,
          node,
        );
      }).toThrow(/The 'auth' prop of an <AuthProvider> should be specified/);
    });
  });

  describe('context', () => {
    let authContext;

    const ContextTester = () => (
      <AuthProvider.Context.Consumer>
        {(auth) => {
          authContext = auth;
        }}
      </AuthProvider.Context.Consumer>
    );

    ContextTester.contextTypes = {
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

    afterEach(() => {
      authContext = undefined;
    });

    const createAuth = () => ({});

    it('can be consumed', () => {
      const auth = createAuth();
      ReactDOM.render(
        <AuthProvider auth={auth}>
          <ContextTester />
        </AuthProvider>,
        node,
      );

      expect(authContext).toBe(auth);
    });
  });
});
