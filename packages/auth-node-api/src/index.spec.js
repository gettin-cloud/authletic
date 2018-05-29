const {
  Auth,
  FormAuthProvider,
} = require('./index');

describe('Package public API', () => {
  it('exports are ok', () => {
    expect(Auth).toBeDefined();
    expect(FormAuthProvider).toBeDefined();
  });
});
