var express = require('express');
var router = express.Router();
var terminal = require('../data/terminal');
var Immutable = require('immutable');
var orchestrator = require('../services/orchestrator')

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

var TerminalUpdate = Immutable.Record({});

router.get('/', function(req, res, next) {
	terminal
    .all()
    .then(
      (terminals)=>{
        res.send(terminals.map(upstreamMapper))
      },
      (err)=>{
        next(err);
      });
});

router.get('/:id', function(req, res, next) {
  var identifier = req.params.id;
  terminal
    .get(identifier)
    .then(
      (terminal)=>{
        res.send(upstreamMapper(terminal));
      },
      (err)=>{
        next(err);
      });
});

router.put('/:id', function(req, res, next) {
  terminal
    .update(req.params.id, TerminalUpdate(req.body))
    .then(
      (terminal)=>{
        res.send(upstreamMapper(terminal));
      },
      (err)=>{
        next(err);
      });
});

router.post('/', function(req, res, next) {
  var order = req.body.order;
  terminal
    .add(order)
    .then(
      (terminal)=>{
        orchestrator.notifyRegistration(); //todo -- data/terminal should probably expose and update stream that orchestrator can subscribe to
        res.send(upstreamMapper(terminal));
      },
      (err)=>{
        next(err);
      });
});

router.delete('/:identifier', function(req, res, next) {
  var identifier = req.params.identifier;
  terminal
    .remove(identifier)
    .then(
      (terminal)=>{
        res.send(upstreamMapper(terminal));
      },
      (err)=>{
        next(err);
      });
});

module.exports = router;