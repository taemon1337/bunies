function Store(socket) {
  var self = this;
  self.store = new JSData.DS();
  self.socket = socket.channel('DS');

  self.store.defineResource({
    name: "documents",
    idAttribute: "_id"
  })

  var Inject = function(data) {
    console.log("INJECT: ", data)
    self.store.inject(data.resource, data.payload, data.options)
  }
  var Eject = function(data) {
    console.log("EJECT: ", data)
    self.store.eject(data.resource, data.payload, data.options)
  }

  var Connect = function(evt, cb) {
    self.socket.on(evt, function(data) {
      if(cb) { cb(data) }
      self.store.definitions[data.resource].emit(evt, data.payload)
    })
  }

  Connect("DS.create", Inject)
  Connect("DS.find", Inject)
  Connect("DS.findAll", Inject)
  Connect("DS.update", Inject)
  Connect("DS.updateAll", Inject)
  Connect("DS.destroy", Eject)
  Connect("DS.destroyAll", Eject)
}

var Passthrough = function(fn) {
  Store.prototype[fn] = function() { 
    return this.store[fn].apply(this.store,arguments)
  }
}

var PassthroughSocket = function(fn) {
  Store.prototype[fn] = function(resource, payload) {
    this.socket.send("DS."+fn, { resource: resource, payload: payload })
  }
};

// Connect Resource/Models event listeners
Store.prototype.on = function(resource, evt, cb) { this.store.definitions[resource].on(evt, cb) };
Store.prototype.off = function(resource, evt, cb) { this.store.definitions[resource].off(evt, cb) };
Store.prototype.emit = function(resource, evt, cb) { this.store.definitions[resource].emit(evt, cb) };

// Passthrough these to emulate a real store
Passthrough("filter")
Passthrough("getAll")

// Connect DS methods with Websocket
PassthroughSocket("create")
PassthroughSocket("find")
PassthroughSocket("findAll")
PassthroughSocket("update")
PassthroughSocket("updateAll")
PassthroughSocket("destroy")
PassthroughSocket("destroyAll")

