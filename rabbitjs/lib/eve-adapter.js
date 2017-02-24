var JSData = require('js-data')
  , Promise = require('bluebird')
  , FormData = require('form-data2')
  , Passthru = require('./passthru')
  , req = require('bhttp')
  , API = process.env.API || 'http://api:8080/api/'
;

var EveAdapter = function(opts) {
  this.basePath = opts.basePath || "/"
}; 

EveAdapter.prototype.URL = function(uri, params) {
  return this.basePath + uri
}

EveAdapter.prototype.GET = function(uri, params) {
  var self = this
  return Promise.try(function() {
    console.log("GET ", self.URL(uri), params)
    return req.get(self.URL(uri), params)
  })
}

EveAdapter.prototype.POST = function(uri, data, opts) {
  var self = this
  return Promise.try(function() {
    console.log("POST ", self.URL(uri), data, opts)
    return req.post(self.URL(uri), data, opts)
  })
}

EveAdapter.prototype.PUT = function(uri, data, opts) {
  var self = this
  return Promise.try(function() {
    console.log("PUT ", self.URL(uri))
    return req.put(self.URL(uri), data, opts)
  })
}

EveAdapter.prototype.pipe = function(def, readable, data, opts) {
  opts = opts || {}
  var self = this
  var form = new FormData()
  form.append('file', req.wrapStream(readable), { filename: data.name, contentType: data.content_type, knownLength: data.size })
//  for(var key in data) { form.append(key, data[key].toString()) }

  return self.create(def, form, opts)
}

EveAdapter.prototype.create = function(def, attrs, opts) {
  return this.POST(def.endpoint || def.name, attrs, opts)
}
EveAdapter.prototype.find = function(def, id, opts) {
  return this.GET((def.endpoint || def.name)+"/"+id, opts)
}
EveAdapter.prototype.findAll = function(def, params, opts) {
  return this.GET((def.endpoint || def.name), params, opts)
}
EveAdapter.prototype.update = function(def, id, opts) {
}
EveAdapter.prototype.updateAll = function(def, params, opts) {
}
EveAdapter.prototype.destroy = function(def, id, opts) {
}
EveAdapter.prototype.destroyAll = function(def, params, opts) {
}

module.exports = function(store) {
  var adapter =  new EveAdapter({ basePath: API })
  store.registerAdapter('eve', adapter, { default: true })
  store.pipe = function(collection, readable, data, opts) {
    return adapter.pipe(store.definitions[collection], readable, data, opts)
  }

  return adapter
}
