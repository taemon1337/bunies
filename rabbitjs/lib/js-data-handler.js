module.exports = function(socket, store) {
  socket.on('connection', function(spark) {
    console.log('CONNECTED TO DS');

    spark.on('DS.create', function(data) {
      store.create(data.resource, data.payload).then(function(payload) {
        console.log("DS.create:", payload)
        spark.send("DS.create", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.find', function(data) {
      store.find(data.resource, data.payload).then(function(payload) {
        console.log("DS.find:", payload)
        spark.send("DS.find", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.findAll', function(data) {
      store.findAll(data.resource, data.payload).then(function(payload) {
        console.log("DS.findAll:", payload)
        spark.send("DS.findAll", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.update', function(data) {
      store.update(data.resource, data.payload).then(function(payload) {
        console.log("DS.update:", payload)
        spark.send("DS.update", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.updateAll', function(data) {
      store.updateAll(data.resource, data.payload).then(function(payload) {
        console.log("DS.updateAll:", payload)
        spark.send("DS.updateAll", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.destroy', function(data) {
      store.destroy(data.resource, data.payload).then(function(payload) {
        console.log("DS.destroy:", payload)
        spark.send("DS.destroy", { resource: data.resource, payload: payload })
      })
    })

    spark.on('DS.destroyAll', function(data) {
      store.destroyAll(data.resource, data.payload).then(function(payload) {
        console.log("DS.destroyAll:", payload)
        spark.send("DS.destroyAll", { resource: data.resource, payload: payload })
      })
    })
  })
}
