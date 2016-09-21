/**
 * Container helper using react-meteor-data.
 */

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import ReactGlassData from './ReactGlassData.jsx';

export default function createContainer(options = {}, Component) {
  let expandedOptions = options;
  if (typeof options === 'function') {
    expandedOptions = {
      getGlassData: options,
    };
  }

  const {
    getGlassData,
    pure = true,
  } = expandedOptions;

  const mixins = [ReactGlassData];
  if (pure) {
    mixins.push(PureRenderMixin);
  }

  /* eslint-disable react/prefer-es6-class */
  return React.createClass({
    displayName: 'GlassDataContainer',
    mixins,
    getGlassData() {
      return getGlassData(this.props);
    },
    render() {
      return <Component {...this.props} {...this.data} />;
    },
  });
}
