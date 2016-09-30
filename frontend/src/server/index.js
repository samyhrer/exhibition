import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfig from '../../config/webpack.config.dev';
import express from 'express';
import DashboardPlugin from 'webpack-dashboard/plugin';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const listen = (app) => {
  var port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`app listening on port ${port}`);
}

const configureDefaultRoutes = (app) => {
  app.use('/static', express.static('./build/static'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/', require('./routes/root'));
  app.use('/no', require('./routes/no'));
  app.use('/en', require('./routes/en'));
}

module.exports = {
  start: () => {
    const app = express();
    configureDefaultRoutes(app);
    listen(app);
  },
  startDev: () => {
    const app = express();

    const assets = JSON.parse(
      fs.readFileSync(
        path.resolve('build', 'webpack-assets.json'),
      'utf8'));

    app.use(assets.bundle.js, function (req, res) {
        res.redirect('http://localhost:3001/bundle.js');
    });

    configureDefaultRoutes(app);
    listen(app);

    // run livereload and webpack dev server
    const compiler = webpack(webpackConfig);
    //compiler.apply(new DashboardPlugin());
    // Run the webpack dev server
    const webpackServer = new WebpackDevServer(compiler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: 'http://localhost:3001',
        noInfo: true,
        hot: true,
        quiet: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })
    .listen(3001, '0.0.0.0', function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Webpack server listening on port 3001');
        }
    });
  }
};
