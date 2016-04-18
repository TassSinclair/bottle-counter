var express = require('express'),
    app = express(),
    http = require('http');

class Server {

	constructor(db) {
		this.db = db;
		this.app = express();
		this.server = http.createServer(app);
	}


}