var Transform = require('stream').Transform;
var util = require('util');

function Passthru(opts) {
  if(!(this instanceof Passthru)) {
    return new Passsthru(opts)
  }
  Transform.call(this, opts)
}
util.inherits(Passthru, Transform);

Passthru.prototype._transform = function(chunk, encoding, cb) {
  this.push(chunk)
  cb()
}

module.exports = Passthru
