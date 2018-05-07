import { createAuth } from './index';

describe('Package public API', () => {
  it('exports createAuth', () => {
    expect(createAuth).toBeDefined();
  });
});
