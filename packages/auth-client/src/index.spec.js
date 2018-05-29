import {
  Auth,
  InMemoryStore,
  FormAuthProvider,
  MockAuthProvider,
} from './index';

describe('Package public API', () => {
  it('exports necessary modules', () => {
    expect(Auth).toBeDefined();
    expect(InMemoryStore).toBeDefined();
    expect(FormAuthProvider).toBeDefined();
    expect(MockAuthProvider).toBeDefined();
  });
});
