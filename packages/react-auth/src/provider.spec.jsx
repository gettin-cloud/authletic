import React from 'react';
import ReactDOM from 'react-dom';
import AuthProvider from './provider';

describe('A <AuthProvider>', () => {
  const node = document.createElement('div');

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  describe('without an auth provided', () => {
    it('throws an error', () => {
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
});
