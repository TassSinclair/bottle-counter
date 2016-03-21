'use strict';

const sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database(':memory:'),
      EventRepository = require('./event-repository.js');

module.exports = {
	eventRepository: new EventRepository(db)
}