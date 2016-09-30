import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import {
  Router,
  browserHistory,
  match } from 'react-router';
import {
  IntlProvider,
  addLocaleData
} from 'react-intl';
import no from 'react-intl/locale-data/no';
import FluxibleComponent from 'fluxible-addons-react/FluxibleComponent';
import translations from '../shared/translations';
import loadPageDataAction from '../shared/actions/loadPageData';
import app from '../shared/application';

const dehydratedState = window.App; // Sent from the server
const bootstrapDebug = debug('Example');

bootstrapDebug('rehydrating app');

function unwindRouteActions(routes) {
  const actions = [];
  routes.forEach((route) => {
    if (route.component.loadAction) {
      actions.push(route.component.loadAction);
    }
  });
  return actions;
}

function renderApp(context) {
  bootstrapDebug('React Rendering');
  const mountNode = document.getElementById('app');
  match({
    routes: app.getComponent(),
    history: browserHistory
  }, (error, redirectLocation, renderProps) => {
    context.executeAction(loadPageDataAction, {
      actions: unwindRouteActions(renderProps.routes),
      params: renderProps.params,
      query: renderProps.location.query
    }, () => {
      ReactDOM.render(
        React.createElement(
          IntlProvider,
          {
            locale: 'no',
            messages: translations.no
          },
          React.createElement(
            FluxibleComponent,
            {
              context: context.getComponentContext()
            },
            React.createElement(Router, {
              routes: context.getComponent(),
              history: browserHistory
            })
          )
        ),
        mountNode,
        () => {
          bootstrapDebug('React Rendered');
        }
      );
    });
  });
}

function run() {
  app.rehydrate(dehydratedState, (err, context) => {
    if (err) {
      throw err;
    }
    window.debug = debug;
    window.context = context;
    renderApp(context);
  });
}

/* eslint-disable */
if (!window.Intl) {
  require.ensure(['intl'], (require) => {
    window.Intl = window.IntlPolyfill = require('intl');
    require('intl/locale-data/jsonp/nb-NO');
    require('expose?ReactIntl!react-intl');
    addLocaleData([...no]);
    run();
  });
} else {
  require('expose?ReactIntl!react-intl');
  addLocaleData([...no]);
  run();
}
/* eslint-enable */
