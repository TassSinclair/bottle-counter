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

  _select(query, params) {
    var deferred = q.defer();
    this.db.all(query, params, (err, rows) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(rows.map(this._rowToEvent));
      }
    });
    return deferred.promise;
  }

  getAll(type) {
    return this._select('SELECT * FROM event WHERE type = ? ORDER BY timestamp',
      [type]);
  }

  getSince(type, since) {
    var timestamp = since.toISOString();
    return this._select('SELECT * FROM event WHERE type = ? AND timestamp >= ? ORDER BY timestamp',
      [type, timestamp]);
  }
}

module.exports = EventRepository;