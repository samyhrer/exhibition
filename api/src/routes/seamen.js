var express = require('express');
var router = express.Router();
var seamenData = require('../data/seamen');
var Immutable = require('immutable');

router.get('/', function(req, res, next) {
  var from = req.query.from || 0;
  var to = req.query.to || 1500;
	seamenData
    .range(from, to)
    .then(
      (seamen)=>{
        res.send(seamen)
      },
      (err)=>{
        next(err);
      });
});

router.get('/:id', function(req, res, next) {

});

module.exports = router;