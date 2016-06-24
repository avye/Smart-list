// @flow
if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept();
}

import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './containers/RootContainer.js';
import 'jquery';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import Store from './store/configureStore.js';

var store = Store();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
