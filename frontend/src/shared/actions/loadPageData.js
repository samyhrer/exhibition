const Promise = require('bluebird');

module.exports = (actionContext, payload, done) => {
  const { actions, params, query } = payload;
  const promises = [];
  actions.foreach((action) => {
    promises.push(new Promise((resolve, reject) => {
      actionContext.executeAction(action, {
        params,
        query
      }, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    }));
  });
  Promise.all(promises).then(() => {
    done(null);
  }, (err) => {
    done(err);
  });
};
