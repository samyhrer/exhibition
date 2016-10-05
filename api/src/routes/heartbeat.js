var express = require('express');
var router = express.Router();
var heartbeatData = require('../data/heartbeat');

router.put('/:id', function(req, res) {
  var identifier = req.params.id;
  heartbeatData.get(identifier)
    .then((heartbeat) => {
      heartbeat = heartbeat.set('timestamp', Date.now());
      heartbeatData.add(heartbeat)
        .then((heartbeat) => {
          return res.send(heartbeat);
        }, (err) => {
          console.log(err);
          next(err);
        })
    }, (err) => {
      //no exisiting heartbeat (which always is created when a terminal is registered)
      //means that the cleanup job may have removed it
      //return error so the client can decide what to do when the
      //server considers the client to be dead.
      res
        .status(404)
        .send(err);
    })
});

module.exports = router;