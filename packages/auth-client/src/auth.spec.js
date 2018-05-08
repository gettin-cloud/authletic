import { Auth } from './auth';
import { InMemoryStore } from './client-store';

describe('Auth', () => {
  describe('#constructor', () => {
    it('throws if options are not passed', () => {
      expect(() => new Auth()).toThrow();
    });

    // it('throws if the \'service\' option is not passed', () => {
    //   expect(() => new Auth({})).toThrow();
    // });

    it('doesn\'t throw if proper options are passed', () => {
      expect(() => new Auth({ service: {} })).toBeDefined();
    });

    it('exposes the public API', () => {
      const auth = new Auth({ service: {} });

      expect(auth.addProvider).toBeDefined();
      expect(auth.signUp).toBeDefined();
      expect(auth.login).toBeDefined();
      expect(auth.logout).toBeDefined();
      expect(auth.getUser).toBeDefined();
      expect(auth.getProfile).toBeDefined();
    });
  });

  describe('#signUp', () => {
    const auth = new Auth({ service: {} });
    const provider = {
      signUp: jest.fn(),
    };

    auth.addProvider('test', provider);

    beforeEach(() => {
      provider.signUp.mockReset();
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
    });
  });

  describe('#login', () => {
    const auth = new Auth({ service: {} });
    const provider = {
      login: jest.fn(),
    };

    auth.addProvider('test', provider);

    beforeEach(() => {
      provider.login.mockReset();
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
    });
  });

  describe('#logout', () => {
    const store = new InMemoryStore();
    const auth = new Auth({ sessionStore: store, appName: 'testApp' });

    beforeEach(() => {
      store.clear();
    });
    it('clears credentials', async () => {
      expect(auth.isAuthenticated()).toBeFalsy();
      store.setItem('testApp_credentials', {});
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
    const auth = new Auth({ service: {} });
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
