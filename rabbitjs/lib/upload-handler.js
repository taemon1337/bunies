var collection = 'documents';

module.exports = function(primus, store) {
  primus.on('connection', function(spark) {
    var ds = null;

    spark.on('subscribe', function(channel, channelSpark) {
      if(channel.name === 'DS') {
        ds = channelSpark
      }
      if(channel.name === 'upload') {
        channelSpark.on('new', function(data) {
          if(data.name) {
            var upstream = spark.substream(data.name);
            upstream.progress = 0;
            upstream.total = data.size;

            store.pipe(collection, upstream, data).then(function(payload) {
              console.log("Streamed File to GridFS and Created: ", payload)
              ds.send("DS.create", { resource: collection, payload: payload })
            }).catch(function(err) {
              console.warn("Error creating new document from gridfs stream", err)
            })

            upstream.on('data', function(chunk) {
              upstream.progress += chunk.length
              channelSpark.send(data.name+':progress',Math.floor(upstream.progress/upstream.total*100))
              console.log(data.name,": ",Math.floor(upstream.progress/upstream.total*100),"%")
            })

            upstream.on('close', function() {
              console.log("UPLOAD CLOSE: ", data.name)
            })

            upstream.on('end', function() {
              console.log('UPSTREAM ENDED!')
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
