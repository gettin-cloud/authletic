import { createAuth } from './create-auth';

describe('createAuth', () => {
  describe('constructor', () => {
    it('throws if options are not passed', () => {
      expect(() => createAuth()).toThrow();
    });

    it('throws if the \'service\' option is not passed', () => {
      expect(() => createAuth({})).toThrow();
    });

    it('doesn\'t throw if proper options are passed', () => {
      expect(() => createAuth({ service: {} })).toBeDefined();
    });

    it('exposes the public API', () => {
      const auth = createAuth({ service: {} });
      const methods = Object.keys(auth);

      expect(methods.length).toBe(5);
      expect(methods).toContain('addProvider');
      expect(methods).toContain('signUp');
      expect(methods).toContain('login');
      expect(methods).toContain('logout');
      expect(methods).toContain('getUser');
    });
  });

  describe('signUp', () => {
    const auth = createAuth({ service: {} });
    const provider = {
      signUp: jest.fn(),
    };

    auth.addProvider('local', provider);

    beforeEach(() => {
      provider.signUp.mockReset();
    });

    it('throws if signs up without a provider', () => {
      expect(() => auth.signUp('unknown')).toThrow();
    });

    it('resolves if its provider resolves', () => {
      const resolveValue = {};
      provider.signUp.mockReturnValueOnce(Promise.resolve(resolveValue));
      return expect(auth.signUp('local')).resolves.toBe(resolveValue);
    });

    it('rejects if its provider rejects', () => {
      const rejectValue = {};
      provider.signUp.mockReturnValueOnce(Promise.reject(rejectValue));
      return expect(auth.signUp('local')).rejects.toBe(rejectValue);
    });

    it('passes sign up options to its provider', () => {
      expect.assertions(1);
      const options = {};

      provider.signUp.mockReturnValueOnce(Promise.resolve());
      return auth.signUp('local', options).then(() => {
        expect(provider.signUp.mock.calls[0][0]).toBe(options);
      });
    });
  });

  describe('login', () => {
    const auth = createAuth({ service: {} });
    const provider = {
      login: jest.fn(),
    };

    auth.addProvider('local', provider);

    beforeEach(() => {
      provider.login.mockReset();
    });

    it('throws if logs in without a provider', () => {
      expect(() => auth.login('unknown')).toThrow();
    });

    it('resolves if its provider resolves', () => {
      const resolveValue = {};
      provider.login.mockReturnValueOnce(Promise.resolve(resolveValue));
      return expect(auth.login('local')).resolves.toBe(resolveValue);
    });

    it('rejects if its provider rejects', () => {
      const rejectValue = {};
      provider.login.mockReturnValueOnce(Promise.reject(rejectValue));
      return expect(auth.login('local')).rejects.toBe(rejectValue);
    });

    it('passes login options to its provider', () => {
      expect.assertions(1);
      const options = {};

      provider.login.mockReturnValueOnce(Promise.resolve());
      return auth.login('local', options).then(() => {
        expect(provider.login.mock.calls[0][0]).toBe(options);
      });
    });
  });

  describe('logout', () => {
    const auth = createAuth({ service: {} });
    const provider = {
      logout: jest.fn(),
    };

    auth.addProvider('local', provider);

    beforeEach(() => {
      provider.logout.mockReset();
    });

    it('throws if logs out without a provider', () => {
      expect(() => auth.logout('unknown')).toThrow();
    });

    it('resolves if its provider resolves', () => {
      const resolveValue = {};
      provider.logout.mockReturnValueOnce(Promise.resolve(resolveValue));
      return expect(auth.logout('local')).resolves.toBe(resolveValue);
    });

    it('rejects if its provider rejects', () => {
      const rejectValue = {};
      provider.logout.mockReturnValueOnce(Promise.reject(rejectValue));
      return expect(auth.logout('local')).rejects.toBe(rejectValue);
    });

    it('passes logout options to its provider', () => {
      expect.assertions(1);
      const options = {};

      provider.logout.mockReturnValueOnce(Promise.resolve());
      return auth.logout('local', options).then(() => {
        expect(provider.logout.mock.calls[0][0]).toBe(options);
      });
    });
  });

  describe('getUser', () => {
    const auth = createAuth({ service: {} });
    const provider = {
      getUser: jest.fn(),
    };

    auth.addProvider('local', provider);

    beforeEach(() => {
      provider.getUser.mockReset();
    });

    it('throws if gets a user without a provider', () => {
      expect(() => auth.logout('unknown')).toThrow();
    });

    it('resolves if its provider resolves', () => {
      const resolveValue = {};
      provider.getUser.mockReturnValueOnce(Promise.resolve(resolveValue));
      return expect(auth.getUser('local')).resolves.toBe(resolveValue);
    });

    it('rejects if its provider rejects', () => {
      const rejectValue = {};
      provider.getUser.mockReturnValueOnce(Promise.reject(rejectValue));
      return expect(auth.getUser('local')).rejects.toBe(rejectValue);
    });

    it('passes options to its provider', () => {
      expect.assertions(1);
      const options = {};

      provider.getUser.mockReturnValueOnce(Promise.resolve());
      return auth.getUser('local', options).then(() => {
        expect(provider.getUser.mock.calls[0][0]).toBe(options);
      });
    });
  });
});
