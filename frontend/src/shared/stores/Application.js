const createStore = require('fluxible/addons').createStore;

const ApplicationStore = createStore({
  storeName: 'ApplicationStore',
  handlers: {},
  initialize() {
    this.locale = 'no';
  },
  getState() {
    return {
      locale: this.locale
    };
  },
  dehydrate() {
    return this.getState();
  },
  rehydrate(state) {
    this.locale = state.locale;
  }
});

module.exports = ApplicationStore;
