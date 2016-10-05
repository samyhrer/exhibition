var heartbeat = require('../data/heartbeat');
var terminal = require('../data/terminal');
var Immutable = require('immutable');

var clean = (timestamp) => {
  console.log("start clean");
  heartbeat.all()
    .then((heartbeats) => {
      console.log("heartbeats", heartbeats.toJS());
      var dead = heartbeats.filter((heartbeat) => {
        return (timestamp - heartbeat.get('timestamp') > 120000)
      });
      console.log("dead", dead.toJS());
      Promise.all(dead
                    .map(heartbeat => heartbeat.get('identifier'))
                    .map(terminal.remove))
        .then((removedTerminals) => {
          console.log("removed terms", removedTerminals);
          Promise.all(Immutable.fromJS(removedTerminals)
                      .map(heartbeat.remove))
            .then((removedHeartbeats) => {
              console.log("removed hbs", removedHeartbeats);
            }, (err) => {
              console.log('error', err);
            });
        }, (err)=>{
          console.log('error', err);
        });
    }, (err) => {
      console.log('error', err);
    });
}

var init = () => {
  clean(Date.now());
  setInterval(() => {
    clean(Date.now());
  }, 20000);
}

module.exports = {
	init: init
}