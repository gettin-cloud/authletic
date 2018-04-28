const { IdentityPool, InMemoryAdapter } = require('./identity-pool');

describe('IdentityPool', () => {
  it('throws if the \'adapter\' option is not specified', () => {
    expect(() => new IdentityPool()).toThrow();
  });
  it('createIdentity works', () => {
    const newId = jest.fn();
    const adapter = new InMemoryAdapter({ newId });
    const pool = new IdentityPool({ adapter });

    newId.mockReturnValueOnce('new_id');
    const login = {
      provider: 'facebook',
      userId: 'someId',
    };
    const meta = { someData: 'test' };
    return expect(pool.createIdentity(login, meta)).resolves.toMatchObject({
      id: 'new_id',
      logins: [login],
      meta,
    });
  });
});
