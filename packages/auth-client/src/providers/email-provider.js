export class EmailProvider {
  constructor(options) {
    if (options === undefined) {
      throw new Error('Options should be provided to create an EmailProvider');
    }

    const { baseUrl } = options;
    if (baseUrl === undefined) {
      throw new Error('The \'baseUrl\' option should be specified');
    }

    this.fetch = options.fetch || window.fetch;

    this.options = {
      providerRelativePath: '/email',
      ...options,
    };
  }
  url(relativePath) {
    const { baseUrl, providerRelativePath } = this.options;
    return `${baseUrl}${providerRelativePath}${relativePath}`;
  }
  postData(url, data) {
    return this.fetch(url, {
      body: JSON.stringify(data),
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
    });
  }
  login(credentials) {
    if (!credentials || !credentials.email || !credentials.password) {
      throw new Error('Creadentials should be provided to the \'login\' method as an object { email, password }');
    }
    return this.postData(this.url('/email/login'), credentials);
  }
}
