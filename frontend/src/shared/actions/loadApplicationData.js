module.exports = function (actionContext, payload, done) {
  actionContext.dispatch('LOAD_APPLICATION_DATA_SUCCESSFUL', payload);
  done();
};