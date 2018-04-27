const {
  PassportAuth,
  LocalProvider,
} = require('./index');

describe('Package public API', () => {
  it('exports are ok', () => {
    expect(PassportAuth).toBeDefined();
    expect(LocalProvider).toBeDefined();
  });
});
