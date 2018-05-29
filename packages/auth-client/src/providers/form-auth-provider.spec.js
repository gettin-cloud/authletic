import { FormAuthProvider } from './form-auth-provider';

describe('FormAuthProvider', () => {
  describe('#login', () => {
    const mockUser = {};
    const fetch = jest.fn().mockResolvedValue(mockUser);
    const provider = new FormAuthProvider({
      baseUrl: 'https://test/',
      fetch,
    });

    it('throws if email is not provided', async () => {
      expect(() => provider.login({ email: '', password: 'test' })).toThrow();
    });

    it('throws if password is not provided', async () => {
      expect(() => provider.login({ email: 'test', password: '' })).toThrow();
    });

    it('requests a proper URL', async () => {
      fetch.mockResolvedValueOnce(mockUser);
      const user = await provider.login({ email: 'test', password: 'test' });
      expect(user).toBe(mockUser);
    });
  });
});
