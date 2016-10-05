
var Immutable = require('immutable');

var heartbeats = Immutable.Map();

var Heartbeat = Immutable.Record({
  identifier: null,
  timestamp: null
});

var all = () => {
  return Promise.resolve(heartbeats.toList());
}

var add = (heartbeat) => {
  heartbeats = heartbeats.set(heartbeat.get('identifier'), heartbeat);
  return Promise.resolve(heartbeat);
}

var get = (identifier) => {
  var heartbeat = heartbeats.find((heartbeat) => {
    return heartbeat.get('identifier') === identifier;
  });
  if(!heartbeat){
    return Promise.reject('You are considered dead');
  }
  return Promise.resolve(heartbeat);
}

var remove = (identifier) => {
  heartbeats = heartbeats.delete(identifier);
  return Promise.resolve(identifier);
}

module.exports = {
  Heartbeat: Heartbeat,
  get: get,
  all: all,
  add: add,
  remove: remove
}