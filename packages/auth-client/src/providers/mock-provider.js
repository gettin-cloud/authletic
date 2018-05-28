export class MockProvider {
  constructor(options) {
    this.options = {
      ...options,
    };
  }
  login(...args) {
    const { login } = this.options;

    if (login) {
      return login(...args);
    }

    return Promise.resolve({ __mock: true });
  }
}
