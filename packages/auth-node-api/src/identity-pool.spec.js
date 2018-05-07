const { IdentityPool, InMemoryAdapter } = require('./identity-pool');

describe('IdentityPool', () => {
  it('throws if the \'adapter\' option is not specified', () => {
    expect(() => new IdentityPool()).toThrow();
  });

  it('createIdentity works', async () => {
    const newId = jest.fn();
    const adapter = new InMemoryAdapter({ newId });
    const pool = new IdentityPool({ adapter });

    newId.mockReturnValueOnce('new_id');
    const login = {
      provider: 'facebook',
      userId: 'someId',
    };
    const meta = { someData: 'test' };
    const identity = await pool.createIdentity(login, meta);
    expect(identity).toMatchObject({
      id: 'new_id',
      logins: [login],
      meta,
    });
  });

  describe('findIdentity', () => {
    let adapter;
    let pool;
    let identity;

    beforeEach(async () => {
      adapter = new InMemoryAdapter();
      pool = new IdentityPool({ adapter });

      const login = {
        provider: 'facebook',
        userId: 'someId',
      };

      identity = await pool.createIdentity(login);
    });

    it('resolves an identity if found', async () => {
      const id = await pool.findIdentity({ provider: 'facebook', userId: 'someId' });
      expect(id).toEqual(identity);
    });

    it('resolves undefined if not found', async () => {
      let id = await pool.findIdentity({ provider: 'facebook', userId: 'unknown' });
      expect(id).toBeUndefined();

      id = await pool.findIdentity({ provider: 'unknown', userId: 'someId' });
      expect(id).toBeUndefined();
    });

    it('throws if a provider or userId is not specified', async () => {
      expect(() => pool.findIdentity({ provider: 'facebook' })).toThrow();
      expect(() => pool.findIdentity({ userId: 'unknown' })).toThrow();
    });
  });
});
