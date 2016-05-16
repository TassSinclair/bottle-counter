'use strict';

const express = require('express'),
    http = require('http'),
    createSocket = require('socket.io');

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
		  res.sendFile(__dirname + '/www/index.html');
		});
		this.app.get('/apple-touch-icon.png', function(req, res){
		  res.sendFile(__dirname + '/www/apple-touch-icon.png');
		});
		this.app.use('/resources', express.static(__dirname + '/../node_modules/'));

		this.app.get('/api/days/:days', (req, res) => {
		  var d = new Date();
		  d.setDate(d.getDate() - req.params.days);
		  this.bottleCounter.getSince(d).then(events => {
		  	res.json({events});
		  });
		});


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
