const {
  Auth,
  EmailProvider,
} = require('./index');

describe('Package public API', () => {
  it('exports are ok', () => {
    expect(Auth).toBeDefined();
    expect(EmailProvider).toBeDefined();
  });
});
