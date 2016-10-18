
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cleanDeadTerminalsService = require('./services/clean-dead-terminals');
var orchestrator = require('./services/orchestrator');
var http = require('http');
var socketIO = require('socket.io')(http);

const listen = (server) => {
  var port = process.env.PORT || 8080;
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
}

module.exports = {
  start: () => {
    const app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    configureDefaultRoutes(app);
    listen(http);
    cleanDeadTerminalsService.init();
    orchestrator.init(io, {
      from: 0,
      to: 1500
    });
  },
  startDev: () => {
    const app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    configureDefaultRoutes(app);
    listen(http);
    cleanDeadTerminalsService.init();
    orchestrator.init(io, {
      from: 0,
      to: 1500
    });
  }
};
