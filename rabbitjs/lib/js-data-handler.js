module.exports = function(socket, store) {
  socket.on('connection', function(spark) {
    console.log('CONNECTED TO DS');

    spark.on('DS.create', function(data) {
      console.log("DS.create:", data)
      store.create(data.resource, data.payload).then(function(payload) {
        spark.send("DS.create", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.find', function(data) {
      console.log("DS.find:", data)
      store.create(data.resource, data.payload).then(function(payload) {
        spark.send("DS.find", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.findAll', function(data) {
      console.log("DS.findAll:", data)
      store.create(data.resource, data.payload).then(function(payload) {
        spark.send("DS.findAll", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.update', function(data) {
      console.log("DS.update:", data)
      store.create(data.resource, data.payload).then(function(payload) {
        spark.send("DS.update", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.updateAll', function(data) {
      console.log("DS.updateAll:", data)
      store.create(data.resource, data.payload).then(function(payload) {
        spark.send("DS.updateAll", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.destroy', function(data) {
      console.log("DS.destroy:", data)
      store.create(data.resource, data.payload).then(function(payload) {
        spark.send("DS.destroy", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.destroyAll', function(data) {
      console.log("DS.destroyAll:", data)
      store.create(data.resource, data.payload).then(function(payload) {
        spark.send("DS.destroyAll", { resource: data.resource, payload: payload })
      })
    })
  })
}
