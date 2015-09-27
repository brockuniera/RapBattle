var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var uuid = require('node-uuid');
var fs = require('fs');
var SparkMD5 = require('spark-md5');
var queue = [];

app.listen(9090);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}

io.on('connection', function(socket) {
	c = {
	 "id" : uuid.v4(),
	 "state": "listener",
	 //"sockobj": socket,
	 "queuepos": NaN,
	};

    queue.push(c);
    socket.emit('config', c);

    socket.on('rap', function(data) {
	//console.log(".");
	console.log(SparkMD5.ArrayBuffer.hash(data));
    	socket.broadcast.volatile.emit('stream', data);
    });

    socket.on('disconnect', function() {
	console.log("disconnected");
    });
});
