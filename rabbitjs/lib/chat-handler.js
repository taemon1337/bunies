var rabbitjs = require('rabbit.js');

function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// I needed the opposite function today, so adding here too:
function htmlUnescape(str){
    return str
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

var clean = function(json) {
  var cleaned = {}
  for(var key in json) {
    cleaned[key] = htmlEscape(json[key])
  }
  return cleaned;
}

module.exports = function(socket) {
  socket.on('connection', function(spark) {
    spark.rabbit = rabbitjs.createContext('amqp://rabbit:DFS@rabbit:5672');

    var onReady = function() {
      spark.pub = spark.rabbit.socket("PUBLISH");
      spark.sub = spark.rabbit.socket("SUBSCRIBE");
      spark.sub.setEncoding('utf8');

      spark.on('message', function(data) {
        spark.pub.write(JSON.stringify(data), 'utf8');
      })

      spark.on('image', function(data) {
        spark.pub.write(JSON.stringify(data), 'utf8');
      })

      spark.on('link', function(data) {
        spark.pub.write(JSON.stringify(data), 'utf8');
      })

      spark.sub.on('data', function(msg) {
        console.log("DATA RECV: ", msg);
        spark.write(JSON.parse(msg));
      });

      spark.sub.connect('chat', function() {
        spark.pub.connect('chat', function() {
          spark.pub.write(JSON.stringify({ user: "server", content: spark.address.ip+" joined" }), 'utf8')
        });
      });
    };

    spark.rabbit.on('ready', onReady);

    spark.rabbit.on('error', function(err) {
      console.warn('MESSAGING ERROR: ', err);
      setTimeout(function() {
        spark.rabbit.on('ready', onReady);
      }, 3000);
    });
  }); // on connection

  socket.on('disconnection', function(spark) {
    console.log("DISCONNECTED: ", spark.address.ip);
    if(spark.pub) { spark.pub.close() }
    if(spark.sub) { spark.sub.close() }
  });
}
