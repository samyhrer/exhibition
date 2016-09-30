var serialize = require('serialize-javascript');
var renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
var renderToString = require('react-dom/server').renderToString;
var debug = require('debug')('Example');
var React = require('react');
var app = require('../../shared/application');
var FluxibleComponent = require('fluxible-addons-react/FluxibleComponent');
var router = require('react-router');
var match = router.match;
import Helmet from "react-helmet";

import {
  IntlProvider
} from 'react-intl';

import { RouterContext } from 'react-router'
import HtmlComponent from '../components/Html';
import loadApplicationDataAction from '../../shared/actions/loadApplicationData';
import loadPageDataAction from '../../shared/actions/loadPageData';
import translations from '../../shared/translations';

function unwindRouteActions (routes, actionContext) {
  var actions = [];
  routes.forEach(function(route){
      if(route.component.loadAction){
          actions.push(route.component.loadAction);
      }
  });
  return actions;
}

module.exports = function (req, res, next) {
  debug('Executing navigate action');

  var context = app.createContext();

  const locale = res.locals.locale;
  const messages = translations[res.locals.locale];

  match({
    routes: app.getComponent(),
    location: `${locale}${req.url}`
  }, function (error, redirectLocation, renderProps) {
    if (error) {
        res.status(500).send(error.message);
    } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      //load base data
      context.executeAction(loadApplicationDataAction, {}, function (err) {
        //load data needed by the route handler
        context.executeAction(loadPageDataAction, {
          actions: unwindRouteActions(renderProps.routes),
          params: renderProps.params,
          query: renderProps.location.query
        }, function (err) {
          var markupElement = React.createElement(
            FluxibleComponent,
            {
              context: context.getComponentContext() },
              React.createElement(IntlProvider, {
                locale: locale,
                messages: messages
              }, React.createElement(RouterContext, renderProps))
          );
          const markup = renderToString(markupElement);
          const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';
          const head = Helmet.rewind();
          var html = renderToStaticMarkup(
            <HtmlComponent
              head={ head }
              state={ exposed }
              markup={ markup } />
          );
          debug('Sending markup');
            res.status(200).send(html);
          });
      });
    } else {
      next();
    }
  })
}