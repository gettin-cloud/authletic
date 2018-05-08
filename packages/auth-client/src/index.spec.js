import { Auth, InMemoryStore } from './index';

describe('Package public API', () => {
  it('exports Auth', () => {
    expect(Auth).toBeDefined();
  });

  it('exports InMemoryStore', () => {
    expect(InMemoryStore).toBeDefined();
  });
});
