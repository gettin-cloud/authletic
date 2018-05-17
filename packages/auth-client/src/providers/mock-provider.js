export class MockProvider {
  constructor(options) {
    this.options = {
      loginResult: {
        __mock: true,
      },
      ...options,
    };
  }
  login() {
    const { failOnLogin, loginResult } = this.options;

    if (failOnLogin) {
      return Promise.reject(failOnLogin);
    }

    return Promise.resolve(loginResult);
  }
}
