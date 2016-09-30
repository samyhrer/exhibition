import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';

import Routes from './components/Routes';

import ApplicationStore from './stores/Application';
import PageStore from './stores/Page';

const app = new Fluxible({
  component: Routes
});

app.plug(fetchrPlugin({ xhrPath: '/_api' }));

app.registerStore(ApplicationStore);
app.registerStore(PageStore);

module.exports = app;
