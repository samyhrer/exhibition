var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.send({
		links: {
      'orchestrator': '/orchestrator',
      'terminal': '/terminal'
    }
	});
});

module.exports = router;
