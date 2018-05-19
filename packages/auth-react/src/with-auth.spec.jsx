import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import { Authenticator, withAuth } from './index';

describe('withAuth', () => {
  const node = document.createElement('div');

  const authMock = {
    isAuthenticated: jest.fn().mockImplementation(() => 'test'),
    setNavigationHistory: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };

  let history;
  beforeEach(() => {
    history = createHistory();
    Object.keys(authMock).forEach(key => authMock[key].mockClear());
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  it('gets an auth instance from the context and passes it as a prop', () => {
    let passedProps;

    const Cmp = (props) => {
      passedProps = props;
      return null;
    };

    const CmpWithAuth = withAuth(Cmp);

    ReactDOM.render(
      <Router history={history}>
        <Authenticator auth={authMock}>
          <CmpWithAuth />
        </Authenticator>
      </Router>,
      node,
    );

    expect(passedProps.auth).toBe(authMock);
    expect(passedProps.isAuthenticated).toBe('test');
  });


  it('subscribes to and unsubscribes from auth', () => {
    const Cmp = () => null;
    const CmpWithAuth = withAuth(Cmp);

    expect(authMock.subscribe.mock.calls).toHaveLength(0);
    expect(authMock.unsubscribe.mock.calls).toHaveLength(0);

    ReactDOM.render(
      <Router history={history}>
        <Authenticator auth={authMock}>
          <CmpWithAuth />
          <CmpWithAuth />
        </Authenticator>
      </Router>,
      node,
    );

    expect(authMock.subscribe.mock.calls).toHaveLength(2);
    expect(authMock.unsubscribe.mock.calls).toHaveLength(0);

    ReactDOM.unmountComponentAtNode(node);
    expect(authMock.subscribe.mock.calls).toHaveLength(2);
    expect(authMock.unsubscribe.mock.calls).toHaveLength(2);
  });
});
