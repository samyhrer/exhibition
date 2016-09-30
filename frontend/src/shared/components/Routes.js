import React from 'react';
import {
	IndexRoute,
	Route
} from 'react-router';

import Application from './Application';
import Frontpage from './Frontpage';

const routes = (
  <Route path=":locale" component={ Application }>
    <IndexRoute component={ Frontpage } />
  </Route>
);

export default routes;
