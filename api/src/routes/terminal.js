var express = require('express');
var router = express.Router();
var terminal = require('../data/terminal');

var upstreamMapper = (terminal) => {
  return {
    links: {
      self: `/terminal/${terminal.identifier}`
    }
  }
}

router.get('/', function(req, res) {
	terminal
    .all()
    .then(
      (terminals)=>{
        res.send(terminals.map(upstreamMapper))
      },
      (err, data)=>{
        res.send('kake')
      });
});

router.post('/', function(req, res, next) {
  var number = req.body.number;
  terminal
    .add(number)
    .then(
      (terminal)=>{
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