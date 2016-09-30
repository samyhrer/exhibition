const createStore = require('fluxible/addons').createStore;

const PageStore = createStore({
  storeName: 'PageStore',
  initialize() {
    this.state = {
      displayName: 'Svein Arild Myhrer'
    };
  },
  handlers: {
    LOAD_PAGE_SUCCESSFUL: 'loadPageSuccessFulHandler'
  },
  loadPageSuccessFulHandler(state) {
    this.state = state;
    this.emitChange();
  },
  getState() {
    return this.state;
  },
  dehydrate() {
    return this.getState();
  },
  rehydrate(state) {
    this.state = state;
  }
});

module.exports = PageStore;
