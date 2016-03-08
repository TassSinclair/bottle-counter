'use strict';
const q = require('q')

class BottleCountDao {
  
  constructor(db) {
    this.db = db;
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS bottlecount (timestamp TEXT)');
    });  
  }

  put(bottleCount) {
    this.db.run('INSERT INTO bottlecount VALUES (?)', 
      [bottleCount.timestamp.toISOString()]);
  }

  _rowToBottleCount(row) {
    return {timestamp: new Date(row.timestamp)};
  }

  getAll() {
    var deferred = q.defer();
    this.db.all('SELECT timestamp FROM bottlecount ORDER BY timestamp', (err, rows) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(rows.map(this._rowToBottleCount));
      }
    });
    return deferred.promise;
  }
}

module.exports = BottleCountDao