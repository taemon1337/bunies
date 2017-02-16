var rabbitjs = require('rabbit.js');

module.exports = function(socket) {
  socket.on('connection', function(spark) {
    spark.rabbit = rabbitjs.createContext('amqp://rabbit:DFS@rabbit:5672');

    var onReady = function() {
      spark.pub = spark.rabbit.socket("PUBLISH");
      spark.sub = spark.rabbit.socket("SUBSCRIBE");
      spark.sub.setEncoding('utf8');

      spark.on('data', function(msg) {
        spark.pub.write(JSON.stringify(msg), 'utf8');
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
