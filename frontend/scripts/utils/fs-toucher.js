var chokidar = require('chokidar');
var touch = require('touch');
var process = require('process')
var path = require('path')

function createWatcher(){
  var src = path.join(process.cwd(), 'src');
  return chokidar.watch(src, {
          ignored: /node_modules|\.swp/i,
          ignoreInitial: true,
          persistent: true,
          usePolling: true
        });
}

function startWatch(watcher){
  watcher
    .on('change', function(path) {
      watcher.close();
      touch(path);
      startWatch(createWatcher());
    });
}

startWatch(createWatcher());
