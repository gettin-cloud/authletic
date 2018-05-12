const {
  Auth,
  LocalProvider,
} = require('./index');

describe('Package public API', () => {
  it('exports are ok', () => {
    expect(Auth).toBeDefined();
    expect(LocalProvider).toBeDefined();
  });
});
