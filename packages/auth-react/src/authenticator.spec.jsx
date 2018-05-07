import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Authenticator } from './index';

describe('A <Authenticator>', () => {
  const node = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  describe('without an auth provided', () => {
    it('throws an error', () => {
      spyOn(console, 'error');

      expect(() => {
        ReactDOM.render(
          <Authenticator>
            <div />
          </Authenticator>,
          node,
        );
      }).toThrow(/The 'auth' prop of an <Authenticator> should be specified/);
    });
  });

  describe('context', () => {
    let authContext;

    const ContextTester = () => (
      <Authenticator.Context.Consumer>
        {(auth) => {
          authContext = auth;
        }}
      </Authenticator.Context.Consumer>
    );

    ContextTester.contextTypes = {
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

    afterEach(() => {
      authContext = undefined;
    });

    const createAuth = () => ({});

    it('can be consumed', () => {
      const auth = createAuth();
      ReactDOM.render(
        <Authenticator auth={auth}>
          <ContextTester />
        </Authenticator>,
        node,
      );

      expect(authContext).toBe(auth);
    });
  });
});
