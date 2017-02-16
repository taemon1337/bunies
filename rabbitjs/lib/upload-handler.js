var collection = 'documents';

var gridstore_options = function(data, record) {
  record = record || {}
  var gopt = {
    _id: data._id || record._id,
    mode: "w",
    filename: data.filename || record.filename,
    content_type: data.content_type || record.content_type,
    chunkSize: 1024,
    root: collection
  }
  return gopt;
}

module.exports = function(primus, store) {
  primus.on('connection', function(spark) {
    spark.on('subscribe', function(channel, channelSpark) {
      if(channel.name === 'upload') {
        channelSpark.on('data', function(data) {
          if(data.filename) {
            var upstream = spark.substream(data.filename);
            upstream.progress = 0;
            upstream.total = data.size;

            if(data._id) {
              store.pipe(upstream, gridstore_options(data), function() {
                console.log('Saved file to GridFS', data);
              })
            } else {
              store.create(collection,data).then(function(resp) {
                store.pipe(upstream, gridstore_options(data, resp), function() {
                  console.log('Saved file to GridFS', resp);
                })
              })
            }

            upstream.on('data', function(chunk) {
              upstream.progress += chunk.length
              console.log(data.filename,": ",Math.floor(upstream.progress/upstream.total*100),"%")
            })

            upstream.on('close', function() {
              console.log("UPLOAD CLOSE: ", data.filename)
            })

            upstream.on('error', function(err) {
              console.log('UPLOAD ERROR: ', err)
              upstream.end();
            })
          }
        });
      }
    })
  })
}
