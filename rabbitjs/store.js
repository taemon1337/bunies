var JSData = require('js-data')
  , mongo = require('mongodb')
  , DSMongoDBAdapter = require('js-data-mongodb')
  , Grid = require('gridfs-stream')
;

module.exports = function() {
  var store = new JSData.DS();
  var adapter = new DSMongoDBAdapter('mongodb://mongo:27017');
  store.registerAdapter('mongodb', adapter, { default: true });
  console.log("MONGO ADAPTER: ", adapter)

  adapter.client.then(function(db) {
    console.log("Connected to Mongo!")
    store.gridfs = Grid(db,mongo);
  })

  // Import Resource/Model
  require('./models/document')(store)

  store.pipe = function(readable, opts, cb) {
    var writestream = store.gridfs.createWriteStream([opts]);

    if(cb) { writestream.on('close', function(resp) { cb(resp) }) }

    writestream.on('error', function(err) {
      console.warn('GridFS streaming error: ', err)
    });

    readable.pipe(writestream);
  }

  return store
}

