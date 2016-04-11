'use strict';

const q = require('q');

class EventRepository {
  
  constructor(db) {
    this.db = db;
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS event (type TEXT, timestamp TEXT)');
    });  
  }

  put(event) {
    this.db.run('INSERT INTO event VALUES (?, ?)', [
      event.type,
      event.timestamp.toISOString()
    ]);
  }

  _rowToEvent(row) {
    return {
      type: row.type,
      timestamp: new Date(row.timestamp)
    };
  }

  getAll() {
    var deferred = q.defer();
    this.db.all('SELECT * FROM event ORDER BY timestamp', (err, rows) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(rows.map(this._rowToEvent));
      }
    });
    return deferred.promise;
  }
}

module.exports = EventRepository;