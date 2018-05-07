const { UserPool } = require('./user-pool');

describe('UserPool', () => {
  it('delegates operations to its adapter', () => {
    const adapter = {
      createUser: jest.fn(),
      deleteUser: jest.fn(),
      updateUser: jest.fn(),
      findUser: jest.fn(),
    };
    const pool = new UserPool({ adapter });

    pool.createUser('create_args');
    pool.deleteUser('delete_args');
    pool.updateUser('update_args');
    pool.findUser('find_args');

    expect(adapter.createUser.mock.calls.length).toBe(1);
    expect(adapter.createUser.mock.calls[0][0]).toBe('create_args');

    expect(adapter.deleteUser.mock.calls.length).toBe(1);
    expect(adapter.deleteUser.mock.calls[0][0]).toBe('delete_args');

    expect(adapter.updateUser.mock.calls.length).toBe(1);
    expect(adapter.updateUser.mock.calls[0][0]).toBe('update_args');

    expect(adapter.findUser.mock.calls.length).toBe(1);
    expect(adapter.findUser.mock.calls[0][0]).toBe('find_args');
  });
});
