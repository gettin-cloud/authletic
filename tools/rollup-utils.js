import { readFileSync } from 'fs';
import { join } from 'path';

export const banner =
`Bundle of <%= pkg.name %>
Generated: <%= moment().format('YYYY-MM-DD') %>
Version: <%= pkg.version %>
License: coming soon...`;

export const external = (packageDirectory, additional) => {
  const pkg = JSON.parse(readFileSync(join(packageDirectory, 'package.json')));
  const externalDependencies = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ];

  return moduleId => {
    if (additional && additional.includes(moduleId)) return true;
    return externalDependencies
      .filter(dependency => moduleId.startsWith(dependency))
      .length > 0;
  };
};

export const babelrc = (packageDirectory) => {
  const config = JSON.parse(readFileSync(join(packageDirectory, '.babelrc')));
  const { presets, plugins } = config;

  const index = presets.findIndex(preset => preset === 'env');
  presets[index] = ['env', { modules: false }];

  plugins.push('external-helpers');

  return config;
};

const knownGlobals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
};

export const globals = () => {
  return (moduleId) => {
      if (moduleId in knownGlobals) return knownGlobals[moduleId];

      const modulePkg = JSON.parse(readFileSync(require.resolve(join(moduleId, 'package.json'))));
      return modulePkg.globalName;
    }
};
