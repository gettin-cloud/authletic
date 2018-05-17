import {
  Auth,
  InMemoryStore,
  EmailProvider,
  MockProvider,
} from './index';

describe('Package public API', () => {
  it('exports necessary modules', () => {
    expect(Auth).toBeDefined();
    expect(InMemoryStore).toBeDefined();
    expect(EmailProvider).toBeDefined();
    expect(MockProvider).toBeDefined();
  });
});
