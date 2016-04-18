'use strict';

const sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database('/home/pi/projects/bottle-counter/database'),
      RepositoryLogger = require('./repository-logger.js'),
      EventRepository = require('./event-repository.js');

module.exports = {
	eventRepository: new RepositoryLogger(new EventRepository(db))
}
