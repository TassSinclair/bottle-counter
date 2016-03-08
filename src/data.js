const sqlite3 = require('sqlite3').verbose(),
      db = new sqlite3.Database(':memory:'),
      BottleCountDao = require('./bottle-count-dao.js');

module.exports = {
	bottleCountDao: new BottleCountDao(db)
}