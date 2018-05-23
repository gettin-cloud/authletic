import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createHistory from 'history/createMemoryHistory';
import { LoginForm, Authenticator } from './index';

describe('LoginForm', () => {
  const node = document.createElement('div');

  const authMock = {
    isAuthenticated: jest.fn().mockImplementation(() => false),
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

  it('throws if not inside the Authenticator', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      ReactDOM.render(
        <LoginForm>{jest.fn()}</LoginForm>,
        node,
      );
    }).toThrow();

    spy.mockRestore();
  });

  it('throws if not a function is specified as child', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      ReactDOM.render(
        <Router history={history}>
          <Authenticator auth={authMock}>
            <LoginForm>
              <div />
            </LoginForm>
          </Authenticator>
        </Router>,
        node,
      );
    }).toThrow();

    spy.mockRestore();
  });

  it('passes proper arguments to the child function', () => {
    const formRenderer = jest.fn().mockImplementation(() => null);

    ReactDOM.render(
      <Router history={history}>
        <Authenticator auth={authMock}>
          <LoginForm>{formRenderer}</LoginForm>
        </Authenticator>
      </Router>,
      node,
    );

    expect(formRenderer.mock.calls).toHaveLength(1);
    expect(Object.keys(formRenderer.mock.calls[0][0])).toHaveLength(3);
    expect(formRenderer.mock.calls[0][0].formData).toEqual({
      email: '',
      password: '',
    });
    expect(formRenderer.mock.calls[0][0].login).toBeDefined();
    expect(formRenderer.mock.calls[0][0].onFormDataChange).toBeDefined();
  });

  it('passes formData back to the child if it changes', () => {
    const formRenderer = jest.fn().mockImplementation(() => null);

    ReactDOM.render(
      <Router history={history}>
        <Authenticator auth={authMock}>
          <LoginForm>{formRenderer}</LoginForm>
        </Authenticator>
      </Router>,
      node,
    );

    expect(formRenderer.mock.calls).toHaveLength(1);
    const { onFormDataChange } = formRenderer.mock.calls[0][0];

    onFormDataChange({ email: 'changed_email' });
    expect(formRenderer.mock.calls).toHaveLength(2);
    expect(formRenderer.mock.calls[1][0].formData).toEqual({
      email: 'changed_email',
      password: '',
    });

    onFormDataChange({ password: 'changed_pwd', unknown: 'unknown' });
    expect(formRenderer.mock.calls).toHaveLength(3);
    expect(formRenderer.mock.calls[2][0].formData).toEqual({
      email: 'changed_email',
      password: 'changed_pwd',
      unknown: 'unknown',
    });
  });
});
