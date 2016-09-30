var express = require("express");
var router = express.Router();

router.get('*', function(req, res, next) {
	res.locals.locale = 'no';
	res.setHeader('X-UA-Compatible', 'IE=edge,chrome=1');
	next();
}, require('./application'));

module.exports = router;
