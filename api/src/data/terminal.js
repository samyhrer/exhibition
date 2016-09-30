var uuid = require('node-uuid');
var terminals = [];

function Terminal(){
  this.identifier = uuid.v4();
}

var all = () => {
  return Promise.resolve(terminals);
}

var get = (identifier) => {
  return Promise.resolve(null);
}

var add = (number) => {
  var terminal = new Terminal();
  terminals.push(terminal);
  return Promise.resolve(terminal);
}

var remove = (identfier) => {
  return Promise.resolve(true);
}

module.exports = {
	all: all,
  get: get,
  add: add,
  remove: remove
}