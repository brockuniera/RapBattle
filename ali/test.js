var http = require('http');
var fs = require('fs');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');

var serve = serveStatic('./', {'index':['index.html']});
var server = http.createServer(function(req, res) {
	var done = finalhandler(req, res);
	serve(req, res, done);
});
server.listen(8000);
