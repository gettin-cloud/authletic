const { LocalProvider } = require('./index');

describe('Package public API', () => {
  it('exports LocalProvider', () => {
    expect(LocalProvider).toBeDefined();
  });
});
