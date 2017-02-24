module.exports = function(socket, store) {
  socket.on('connection', function(spark) {
    console.log('CONNECTED TO DS');

    var PassthroughSocket = function(fn, send_to_all) {
      var evt = "DS."+fn
      spark.on(evt, function(data) {
        store[fn](data.resource, data.payload).then(function(payload) {
//          console.log(evt, payload)
          if(send_to_all) {
            socket.send(evt, { resource: data.resource, payload: payload })
          } else {
            spark.send(evt, { resource: data.resource, payload: payload })
          }
        })
      })
    }

    // These events should only notify the requesting connections
    PassthroughSocket("find");
    PassthroughSocket("findAll");

    // These events should notify ALL connected sockets
    PassthroughSocket("create", true);
    PassthroughSocket("update", true);
    PassthroughSocket("updateAll", true);
    PassthroughSocket("destroy", true);
    PassthroughSocket("destroyAll", true);

/*
    spark.on('DS.create', function(data) {
      store.create(data.resource, data.payload).then(function(payload) {
        console.log("DS.create:", payload)
        socket.send("DS.create", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.find', function(data) {
      store.find(data.resource, data.payload).then(function(payload) {
        console.log("DS.find:", payload)
        spark.send("DS.find", { resource: data.resource, payload: payload })
      })
    })
*/

  })
}
