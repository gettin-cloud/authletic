export function createAuth(authOptions) {
  let options = {
    ...authOptions,
  };
  let currentUser;

  if (authOptions === undefined) {
    throw new Error('Options should be provided to create an Auth');
  }

  const { service } = authOptions;
  if (service === undefined) {
    throw new Error('The \'service\' option should be specified');
  }

  const providers = {};

  function addProvider(name, provider) {
    if (providers[name]) {
      throw new Error(`The '${name}' provider already added`);
    }
    providers[name] = provider;
  }

  function getProvider(providerName) {
    const provider = providers[providerName];
    if (!provider) {
      throw new Error(`The '${providerName}' is not registered. Use auth.addProvider() before.`);
    }
    return provider;
  }

  function proxyToProvider(method) {
    return (providerName, methodOptions) => {
      const provider = getProvider(providerName);
      return provider[method](methodOptions);
    };
  }

  function login(providerName, loginOptions) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const loggedUser = {
          username: 'test user',
        };
        currentUser = loggedUser;
        if (options.onStateChange) {
          options.onStateChange();
        }
        resolve(currentUser);
      }, 2000);
    });
  }

  function isAuthenticated() {
    return !!currentUser;
  }

  function getUser() {
    return currentUser;
  }

  return {
    isAuthenticated,
    addProvider,
    getUser,
    signUp: proxyToProvider('signUp'),
    login, // : proxyToProvider('login'),
    logout: proxyToProvider('logout'),
    getProfile: proxyToProvider('getProfile'),
  };
}
