import { MockProvider } from './mock-provider';

describe('MockProvider', () => {
  describe('#login', () => {
    it('returns mock result by default', async () => {
      const provider = new MockProvider();
      expect(provider.login()).resolves.toBeDefined();
    });

    it('throws if failOnLogin is specified', async () => {
      const failOnLogin = {};
      const provider = new MockProvider({ failOnLogin });
      expect(provider.login()).rejects.toBe(failOnLogin);
    });
  });
});
