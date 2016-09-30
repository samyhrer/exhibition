var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const listen = (app) => {
  var port = process.env.PORT || 8080;
  app.listen(port);
  console.log(`app listening on port ${port}`);
}

const configureDefaultRoutes = (app) => {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/', require('./routes/root'));
  app.use('/terminal', require('./routes/terminal'));
}

module.exports = {
  start: () => {
    const app = express();
    configureDefaultRoutes(app);
    listen(app);
  },
  startDev: () => {
    const app = express();
    configureDefaultRoutes(app);
    listen(app);
  }
};
