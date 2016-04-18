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
		this.bottleCounter.on('countUpdate', (newCount) => this.onNewCountReceived(newCount));
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
