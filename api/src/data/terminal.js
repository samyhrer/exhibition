var Immutable = require('immutable');
var uuid = require('node-uuid');
var heartbeat = require('./heartbeat');

var terminals = Immutable.List();

const PROVISION_STATES = {
  'NOT_PROVISIONED': 1,
  'IN_PROGRESS': 2,
  'PROVISIONED': 3,
}

var Terminal = Immutable.Record({
  identifier: uuid.v4(),
  provisionState: PROVISION_STATES.NOT_PROVISIONED,
  datarange: {
    from: 0,
    to: 100
  }
});

var byIdentifier = (identifier) => {
  return (terminal) => {
    return terminal.get('identifier') === identifier;
  }
}

var all = () => {
  return Promise.resolve(terminals);
}

var get = (identifier) => {
  var terminal = terminals.find((terminal)=>{
    return terminal.get('identifier') === identifier;
  });
  return Promise.resolve(terminal);
}

var add = (order) => {
  return new Promise((resolve, reject)=>{
    var identifier = uuid.v4();
    var terminal = new Terminal({
      identifier
    });
    terminals = terminals.insert(order, terminal);
    heartbeat.add(new heartbeat.Heartbeat({
      identifier,
      timestamp: Date.now()
    })).then((heartbeat) => {
      resolve(heartbeat);
    }, (err) => {
      reject('add error: ', err)
    });
  });
}

var update = (identifier, update) => {
  console.log(update)
  terminals = terminals.update(terminals.findIndex(byIdentifier(identifier)), (terminal) => {
    return terminal.mergeDeep(update);
  });
  return get(identifier);
}

var remove = (identifier) => {
  return new Promise((resolve, reject) => {
    get(identifier)
      .then((terminal)=>{
        terminals = terminals.remove(terminals.findIndex(byIdentifier(identifier)));
        resolve(identifier);
      }, reject);
  });
}

module.exports = {
  PROVISION_STATES: PROVISION_STATES,
	all: all,
  get: get,
  add: add,
  remove: remove,
  update: update
}