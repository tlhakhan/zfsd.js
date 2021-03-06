let NodeCache = require('node-cache');
let cache = new NodeCache();

// fork the service to separate thread.
let path = require('path');
let cp = require('child_process');
let service = cp.fork(path.join(__dirname, './service'));

service.on('message', (msg) => {
  console.log(`Setting cache for ${msg.type}`)
  cache.set(msg.type, msg.data);
});

module.exports = cache;
