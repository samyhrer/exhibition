var server = require('http').createServer();
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({ server: server })
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cleanDeadTerminalsService = require('./services/clean-dead-terminals');
var orchestrator = require('./services/orchestrator');

const listen = (app) => {
  var port = process.env.PORT || 8080;
  server.on('request', app);
  server.listen(port, function () {
    console.log('Listening on ' + server.address().port)
  });
}

const configureDefaultRoutes = (app) => {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/api/', require('./routes/root'));
  app.use('/api/terminal', require('./routes/terminal'));
  app.use('/api/seamen', require('./routes/seamen'));
  app.use('/api/heartbeat', require('./routes/heartbeat'));
  wss.on('connection', function connection(ws) {
    orchestrator.add(ws);
  });
}

module.exports = {
  start: () => {
    const app = express();
    configureDefaultRoutes(app);
    listen(app);
    cleanDeadTerminalsService.init();
    orchestrator.init(0, 100);

  },
  startDev: () => {
    const app = express();
    configureDefaultRoutes(app);
    listen(app);
    cleanDeadTerminalsService.init();
    orchestrator.init(0, 100);
  }
};
