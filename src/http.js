'use strict';

var express = require('express'),
    http = require('http');

var createSocket = require('socket.io');

class HttpServer {
	constructor(port, bottleCounter) {
		this.port = port;
		this.bottleCounter = bottleCounter;
	}

	start() {
		this.app = express();
		this.http = http.Server(this.app);
		this.io = createSocket(this.http);

		this.app.get('/', function(req, res){
		  res.sendfile(__dirname + '/www/index.html');
		});
		this.app.get('/apple-touch-icon.png', function(req, res){
		  res.sendfile(__dirname + '/www/apple-touch-icon.png');
		});
		this.app.use('/resources', express.static(__dirname + '/../node_modules/'));


		this.io.on('connection', (socket) => this.onConnection(socket));
		this.bottleCounter.on('countUpdate', (newCount) => this.onNewCountReceived(newCount));
		this.http.listen(this.port);
	}

	onConnection(socket) {
		console.log("Connection!");

		socket.emit('count', this.createCountMessage(this.bottleCounter.currentCount));
	}

	createCountMessage(count) {
		return {
			currentCount: count
		};
	}

	onNewCountReceived(newCount) {
		console.log("Broadcasting update: new count is " + newCount);

		this.io.emit('count', this.createCountMessage(newCount));
	}
}

module.exports = HttpServer;
