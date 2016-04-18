'use strict';

var createSocket = require('socket.io');

class HttpServer {
	constructor(port, bottleCounter) {
		this.port = port;
		this.bottleCounter = bottleCounter;
	}

	start() {
		this.io = createSocket(this.port);
		this.io.on('connection', (socket) => this.onConnection(socket));
	}

	onConnection(socket) {
		console.log("Connection!");

	  socket.emit('count', this.createCountMessage());
	}

	createCountMessage() {
		return {
	  	currentCount: this.bottleCounter.currentCount
	  };
	}
}

module.exports = HttpServer;
