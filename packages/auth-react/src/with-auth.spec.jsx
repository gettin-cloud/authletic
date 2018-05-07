import React from 'react';
import ReactDOM from 'react-dom';
import { Authenticator, withAuth } from './index';

describe('withAuth', () => {
  const node = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  it('gets an auth instance from the context and passes it as a prop', () => {
    let passedProps;

    const Cmp = (props) => {
      passedProps = props;
      return null;
    };

    const auth = {};

    const CmpWithAuth = withAuth(Cmp);

    ReactDOM.render(
      <Authenticator auth={auth}>
        <CmpWithAuth />
      </Authenticator>,
      node,
    );

    expect(passedProps.auth).toBe(auth);
  });
});
