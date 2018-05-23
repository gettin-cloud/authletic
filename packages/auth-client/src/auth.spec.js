import { Auth } from './auth';
import { InMemoryStore } from './client-store';

describe('Auth', () => {
  describe('#constructor', () => {
    it('exposes the public API', () => {
      const auth = new Auth();

      expect(auth.addProvider).toBeDefined();
      expect(auth.signUp).toBeDefined();
      expect(auth.login).toBeDefined();
      expect(auth.logout).toBeDefined();
      expect(auth.getUser).toBeDefined();
      expect(auth.getProfile).toBeDefined();
      expect(auth.getLoginPath).toBeDefined();
    });

    it('has default configuration', () => {
      const auth = new Auth();
      expect(auth.getLoginPath()).toBe('/login');
    });
  });

  describe('#addProvider', () => {
    it('adds a provider', () => {
      const auth = new Auth();
      const provider = {};
      expect(auth.providers).toEqual({});
      auth.addProvider('test', provider);
      expect(auth.getProvider('test')).toBe(provider);
    });

    it('throws if a provider is registered with existing name', () => {
      const auth = new Auth();
      expect(() => {
        auth.addProvider('test', {});
        auth.addProvider('test', {});
      }).toThrow();
    });

    it('throws if a provider is not registered', () => {
      const auth = new Auth();
      expect(() => {
        auth.getProvider('test');
      }).toThrow();
    });
  });

  describe('#signUp', () => {
    const sessionStore = new InMemoryStore();
    const auth = new Auth({ sessionStore, appName: 'testApp' });

    const provider = {
      signUp: jest.fn(),
    };

    auth.addProvider('test', provider);

    beforeEach(() => {
      provider.signUp.mockReset();
      sessionStore.clear();
    });

    it('throws if signs up without a provider', () => {
      expect(() => auth.signUp('unknown')).toThrow();
    });

    it('resolves if its provider resolves', () => {
      const resolveValue = {};
      provider.signUp.mockReturnValueOnce(Promise.resolve(resolveValue));
      return expect(auth.signUp('test')).resolves.toBe(resolveValue);
    });

    it('rejects if its provider rejects', () => {
      const rejectValue = {};
      provider.signUp.mockReturnValueOnce(Promise.reject(rejectValue));
      return expect(auth.signUp('test')).rejects.toBe(rejectValue);
    });

    it('passes sign up options to its provider', () => {
      expect.assertions(1);
      const options = {};

      provider.signUp.mockReturnValueOnce(Promise.resolve());
      return auth.signUp('test', options).then(() => {
        expect(provider.signUp.mock.calls[0][0]).toBe(options);
      });
    });

    it('stores credentials', () => {
      expect.assertions(1);
      const options = {};
      const credentials = { test: 'credentials' };

      provider.signUp.mockReturnValueOnce(Promise.resolve(credentials));
      return auth.signUp('test', options).then(() => {
        expect(JSON.parse(sessionStore.getItem('testApp_credentials'))).toEqual(credentials);
      });
    });
  });

  describe('#login', () => {
    const sessionStore = new InMemoryStore();
    const auth = new Auth({ sessionStore, appName: 'testApp' });
    const history = {
      replace: jest.fn(),
    };

    auth.setNavigationHistory(history);

    const provider = {
      login: jest.fn(),
    };

    auth.addProvider('test', provider);

    beforeEach(() => {
      provider.login.mockReset();
      sessionStore.clear();
      history.replace.mockClear();
      history.location = {};
    });

    it('throws if logs in without a provider', () => {
      expect(() => auth.login('unknown')).toThrow();
    });

    it('resolves if its provider resolves', () => {
      const resolveValue = {};
      provider.login.mockReturnValueOnce(Promise.resolve(resolveValue));
      return expect(auth.login('test')).resolves.toBe(resolveValue);
    });

    it('rejects if its provider rejects', () => {
      const rejectValue = {};
      provider.login.mockReturnValueOnce(Promise.reject(rejectValue));
      return expect(auth.login('test')).rejects.toBe(rejectValue);
    });

    it('passes login options to its provider', () => {
      expect.assertions(1);
      const options = {};

      provider.login.mockReturnValueOnce(Promise.resolve());
      return auth.login('test', options).then(() => {
        expect(provider.login.mock.calls[0][0]).toBe(options);
      });
    });

    it('stores credentials', () => {
      expect.assertions(1);
      const credentials = { test: 'credentials' };

      provider.login.mockReturnValueOnce(Promise.resolve(credentials));
      return auth.login('test').then(() => {
        expect(JSON.parse(sessionStore.getItem('testApp_credentials'))).toEqual(credentials);
      });
    });

    it('redirects back after authentication', () => {
      provider.login.mockReturnValueOnce(Promise.resolve({}));
      history.location = {
        search: '?redirect=/back-uri',
      };
      return auth.login('test').then(() => {
        expect(auth.history.replace.mock.calls).toHaveLength(1);
        expect(auth.history.replace.mock.calls[0][0]).toBe('/back-uri');
      });
    });
  });

  describe('#logout', () => {
    const sessionStore = new InMemoryStore();
    const auth = new Auth({ sessionStore, appName: 'testApp' });

    beforeEach(() => {
      sessionStore.clear();
    });

    it('clears credentials', async () => {
      expect(auth.isAuthenticated()).toBeFalsy();
      sessionStore.setItem('testApp_credentials', {});
      expect(auth.isAuthenticated()).toBeTruthy();
      auth.logout();
      expect(auth.isAuthenticated()).toBeFalsy();
    });

    it('does\'n throw if not logged in', async () => {
      expect(auth.isAuthenticated()).toBeFalsy();
      auth.logout();
    });
  });

  describe('getUser', () => {
    const auth = new Auth();
    const provider = {
      login: jest.fn(),
    };

    auth.addProvider('test', provider);

    beforeEach(() => {
      provider.login.mockReset();
    });

    it('returns undefined without login', () => {
      expect(auth.getUser()).toBeUndefined();
    });

    // it('returns a user if logged in', () => {
    //   const user = {};
    //   provider.login.mockReturnValueOnce(Promise.resolve(user));
    //   expect(auth.getUser()).toBe(user);
    // });
  });
});
