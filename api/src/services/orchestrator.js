
var Immutable = require('immutable');
var uuid = require('node-uuid');
var terminalData = require('../data/terminal');
var seamen = require('../data/seamen');
var websocketClients = [];

var upstreamMapper = (terminal) => {
  return {
    type: 'terminal',
    id: terminal.get('identifier'),
    attributes: {
      heartbeatTimestamp: terminal.get('heartbeatTimestamp')
    },
    links: {
      self: `/terminal/${terminal.get('identifier')}`,
      api: `/api/terminal/${terminal.get('identifier')}`,
      heartbeat: `/api/heartbeat/${terminal.get('identifier')}`,
      seamen: `/api/seamen`,
    }
  }
}

var reset = () => {}

var from = 0;
var to = 100;


var init = (from, to) => {
  from = 0;
  to = to;
  orchestrate();
  setInterval(orchestrate, 10000);
}

var notProvisionedTerminal = (terminal) => {
  return terminal.get('provisionState') === terminalData.PROVISION_STATES.NOT_PROVISIONED;
}
var provsionInProgressTerminal = (terminal) => {
  return terminal.get('provisionState') === terminalData.PROVISION_STATES.IN_PROGRESS;
}

var orchestrate = () => {
  terminalData
    .all()
    .then((terminals) => {
      terminals.find(provsionInProgressTerminal);
      if(terminals.find(provsionInProgressTerminal)){
        console.log("provision in progress. skip further action")
        return
      }
      var terminal = terminals.find(notProvisionedTerminal);
      terminalData.update(terminal.get('identifier'), {
        provisionState: terminalData.PROVISION_STATES.IN_PROGRESS
      }).then((terminal)=>{
        console.log("orcestrate terminal" , terminal);
        websocketClients.forEach((ws) => {
          ws.send(JSON.stringify({
            type: 'START_PROVISION',
            payload: {
              identifier: terminal.get('identifier'),
              datarange: {
                from: from,
                to: to
              }
            }
          }))
        });
      }, ()=>{});
    }, (err) => {
      console.log(err);
    })
}

var handleMessage = (message, flags) => {
  var message= JSON.parse(message);
  var type = message.type;
  var payload = message.payload;
  switch(type){
    case 'PROVISION_DONE':
      //The client has found the set of data that fills the screen. ends the provision process
      console.log(payload)
      from = payload.datarange.to;
      to = from + 100;
      var identifier = payload.identifier;
      terminalData.update(identifier, {
        provisionState: terminalData.PROVISION_STATES.PROVISIONED
      }).then((terminal)=>{

      }, () => {

      })
      break;
  }
}

var add = (ws) => {
  websocketClients.push(ws);
  ws.on('message', handleMessage);
}

var notifyRegistration = () => {
  terminalData
    .all()
    .then(
      (terminals) => {
        var msg = JSON.stringify({
                    type: 'REGISTER_SCREEN_UPDATE',
                    payload: terminals.map(upstreamMapper)
                  });
        websocketClients.forEach((ws) => {
          ws.send(msg)
        });
      },
      (err)=>{
        next(err);
      });
}

module.exports = {
  notifyRegistration: notifyRegistration,
  add: add,
  reset: reset,
  init: init
}
