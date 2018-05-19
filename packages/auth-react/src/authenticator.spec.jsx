import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import { Authenticator } from './index';

describe('A <Authenticator>', () => {
  const node = document.createElement('div');
  const authMock = {
    setNavigationHistory: jest.fn(),
  };

  let history;
  beforeEach(() => {
    history = createHistory();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  it('sets history to the auth', () => {
    ReactDOM.render(
      <Router history={history}>
        <Authenticator auth={authMock}>
          <div />
        </Authenticator>
      </Router>,
      node,
    );

    expect(authMock.setNavigationHistory.mock.calls).toHaveLength(1);
    expect(authMock.setNavigationHistory.mock.calls[0][0]).toBe(history);
  });

  describe('without an auth provided', () => {
    it('throws an error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        ReactDOM.render(
          <Router history={history}>
            <Authenticator>
              <div />
            </Authenticator>
          </Router>,
          node,
        );
      }).toThrow();

      spy.mockRestore();
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

    it('can be consumed', () => {
      ReactDOM.render(
        <Router history={history}>
          <Authenticator auth={authMock}>
            <ContextTester />
          </Authenticator>
        </Router>,
        node,
      );

      expect(authContext).toBe(authMock);
    });
  });
});
