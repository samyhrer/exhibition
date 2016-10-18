
var Immutable = require('immutable');
var uuid = require('node-uuid');
var terminalData = require('../data/terminal');
var seamen = require('../data/seamen');

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
var xy = null;

var init = (io, config) => {
  xy = io;
  io.on('connection', function(socket){
    console.log('screen or terminal connected');
    socket.on('PROVISION_DONE', handleProvisionDone);
    socket.on('disconnect', function(){
      console.log('screen or terminal disconnected');
    });
  });
  
  from = config.from;
  to = config.to;
  orchestrate(io);
  setInterval(()=>{
    orchestrate(io)
  }, 10000);
}

var notProvisionedTerminal = (terminal) => {
  return terminal.get('provisionState') === terminalData.PROVISION_STATES.NOT_PROVISIONED;
}

var provsionInProgressTerminal = (terminal) => {
  return terminal.get('provisionState') === terminalData.PROVISION_STATES.IN_PROGRESS;
}

var orchestrate = (io) => {
  terminalData
    .all()
    .then((terminals) => {
      var terminalBeeingProvisioned = terminals.find(provsionInProgressTerminal);
      if(terminalBeeingProvisioned){
        console.log("provision in progress. skip further action", terminalBeeingProvisioned.identifier);
        return
      }
      var terminal = terminals.find(notProvisionedTerminal);
      if(!terminal) {
        return
      }
      return terminalData.update(terminal.get('identifier'), {
        provisionState: terminalData.PROVISION_STATES.IN_PROGRESS
      })
    })
    .then(function(terminal){
      if(!terminal){
        return;
      }
      console.log("orcestrate terminal" , terminal);
      io.emit('START_PROVISION', {
        identifier: terminal.get('identifier'),
        datarange: {
          from: from,
          to: to
        }
      });
    })
    .catch((err) => { 
      console.log(err)
    })
}

var handleProvisionDone = (payload) => {
  //The client has found the set of data that fills the screen. ends the provision process
  from = payload.datarange.to;
  to = from + 100;
  var identifier = payload.identifier;
  terminalData.update(identifier, {
    provisionState: terminalData.PROVISION_STATES.PROVISIONED
  }).then((terminal)=>{}, () => {})
}

var notifyRegistration = () => {
  terminalData
    .all()
    .then(
      (terminals) => {
        xy.emit('REGISTER_SCREEN_UPDATE', terminals.map(upstreamMapper))
      },
      (err)=>{
        next(err);
      });
}

module.exports = {
  notifyRegistration: notifyRegistration,
  reset: reset,
  init: init
}
