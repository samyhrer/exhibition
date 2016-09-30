var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.redirect(301, '/no');
});

module.exports = router;
