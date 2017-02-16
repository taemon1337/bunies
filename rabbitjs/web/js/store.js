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

  self.socket.on("DS.create", Inject);
  self.socket.on("DS.find", Inject);
  self.socket.on("DS.findAll", Inject);
  self.socket.on("DS.update", Inject);
  self.socket.on("DS.updateAll", Inject);
  self.socket.on("DS.destroy", Eject);
  self.socket.on("DS.destroyAll", Eject);
}

// Connect Resource/Models event listeners
Store.prototype.on = function(resource, evt, cb) { this.store.definitions[resource].on(evt, cb) };
Store.prototype.off = function(resource, evt, cb) { this.store.definitions[resource].off(evt, cb) };
Store.prototype.emit = function(resource, evt, cb) { this.store.definitions[resource].emit(evt, cb) };

// Passthrough Methods
Store.prototype.filter = function(resource, params, opts) { return this.store.filter.apply(this.store, arguments) };
Store.prototype.getAll = function(resource, params, opts) { return this.store.getAll.apply(this.store, arguments) };

// Connect DS methods with Websocket
Store.prototype.create = function(resource, payload) { this.socket.send("DS.create", { resource: resource, payload: payload }) };
Store.prototype.find = function(resource, payload) { this.socket.send("DS.find", { resource: resource, payload: payload }) };
Store.prototype.findAll = function(resource, payload) { this.socket.send("DS.findAll", { resource: resource, payload: payload }) };
Store.prototype.update = function(resource, payload) { this.socket.send("DS.update", { resource: resource, payload: payload }) };
Store.prototype.updateAll = function(resource, payload) { this.socket.send("DS.updateAll", { resource: resource, payload: payload }) };
Store.prototype.destroy = function(resource, payload) { this.socket.send("DS.destroy", { resource: resource, payload: payload }) };
Store.prototype.destroyAll = function(resource, payload) { this.socket.send("DS.destroyAll", { resource: resource, payload: payload }) };

