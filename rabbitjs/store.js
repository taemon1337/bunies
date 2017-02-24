var JSData = require('js-data')
    adapter = process.env.DATABASE_ADAPTER || "mongo"
;

module.exports = function() {
  var store = new JSData.DS();
  require('./lib/'+adapter+'-adapter')(store)
  require('./models/document')(store)
  return store
}

