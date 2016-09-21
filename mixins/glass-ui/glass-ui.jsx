import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  react: '15.x',
  'react-addons-pure-render-mixin': '15.x',
}, 'glass-ui');

const createContainer = require('./createContainer.jsx').default;
const ReactGlassData = require('./ReactGlassData.jsx').default;

export { createContainer, ReactGlassData };
