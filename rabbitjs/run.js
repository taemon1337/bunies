var express = require('express')
  , Primus = require('primus.io')
  , http = require('http')
  , bhttp = require('bhttp')
  , request = require('request')
  , app = express()
  , server = http.createServer(app)
  , store = require('./store')()
  , port = process.env.PORT || 8080
  , env = process.env.ENV || 'dev'
  , API = process.env.API || 'http://api:8080'
  ;

var primus = new Primus(server, { transformer: 'sockjs', parser: "JSON" })

primus.plugin('substream', require('substream'));

app.use(express.static('web'));
app.use('/common', express.static('/common'));
app.use('/models', express.static('./models'));

app.all('/api*', function(req, res) {
  req.pipe(request(API+req.originalUrl)).pipe(res);
});

// Module Handlers
require('./lib/chat-handler')(primus.channel('chat'));
require('./lib/upload-handler')(primus, store);
require('./lib/js-data-handler')(primus.channel('DS'), store);

server.listen(port, function() { console.log('Listening on ' + server.address().port) });
