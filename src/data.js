'use strict';

const sqlite3 = require('sqlite3').verbose(),
      RepositoryLogger = require('./repository-logger.js'),
      EventRepository = require('./event-repository.js');

function getDatabase() {
  if (process.env.NODE_ENV === "development") {
    return new sqlite3.Database(':memory:');
  }
  return new sqlite3.Database('/home/pi/bottle-counter-database.sqlite3')
}

module.exports = {
	eventRepository: new RepositoryLogger(new EventRepository(getDatabase()))
}
