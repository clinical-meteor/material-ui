Package.describe({
  name: 'react-glass-ui',
  summary: 'Mixin that provides opacity, transparency, and blur to React components.',
  version: '0.0.1',
  documentation: 'README.md',
  git: 'https://github.com/clinical-meteor/material-fhir-ui/mixins/glass-ui',
});

Package.onUse(function (api) {
  api.versionsFrom('1.3');
  api.use('tracker');
  api.use('ecmascript');
  api.use('tmeasday:check-npm-versions@0.2.0');

  api.export(['GlassUserInterface']);

  api.mainModule('glass-ui.jsx');
});
