var JSData = require('js-data')
  , mongo = require('mongodb')
  , Promise = require('bluebird')
  , DSMongoDBAdapter = require('js-data-mongodb')
  , Grid = require('gridfs-locking-stream')
;

var gridstore_options = function(data) {
  return {
//    _id: data._id || null,
    mode: "w",
    filename: data.name,
    content_type: data.content_type,
    chunkSize: 1024
  }
}

module.exports = function(store) {
  var adapter = new DSMongoDBAdapter('mongodb://mongo:27017/bunies-api');
  store.registerAdapter('mongodb', adapter, { default: true });

  store.pipe = function(collection, readable, data) {
    return new Promise(function(resolve, reject) {
      store.gridfs.createWriteStream(gridstore_options(data), function(err, writestream) {
        if(err) {
          console.warn("GridFS streaming error: ", err)
          reject(err)
        } else if(writestream) {
          writestream.on('close', function(resp) {
            var newdata = { file: resp._id.toString() }
            for(var key in data) { newdata[key] = data[key] }
            store.create(collection, newdata).then(function(payload) {
              resolve(payload) 
            }).catch(function(err) {
              console.log("Error creating record in " + collection, newdata, err)
              reject(err)
            })
          })
          writestream.on('error', function(err) {
            if(err) { reject(err) }
          })

          readable.pipe(writestream)
        } else {
          console.warn("GridFS write lock was not available!")
          reject("GridFS write lock was not available")
        }
      })
    })
  }

  adapter.client.then(function(db) {
    console.log("Connected to Mongo!")
    store.gridfs = Grid(db,mongo);
  })
}
