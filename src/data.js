'use strict';

const sqlite3 = require('sqlite3').verbose(),
	  config = require('./config.js'),
      RepositoryLogger = require('./repository-logger.js'),
      EventRepository = require('./event-repository.js');

function getDatabase() {
  if (config.isDev) {
    return new sqlite3.Database(':memory:');
  }
  return new sqlite3.Database('/home/pi/projects/bottle-counter/database')
}

module.exports = {
	eventRepository: new RepositoryLogger(new EventRepository(getDatabase()))
}
