'use strict';

var BottleCountDao = require('../src/bottle-count-dao'),
    sqlite3 = require('sqlite3').verbose();

describe('BottleCountDao', () => {

  describe('interacting with a fresh database', () => {
    var bottleCountDao, db;

    beforeEach(() => {
      db = new sqlite3.Database(':memory:');
      bottleCountDao = new BottleCountDao(db);
    });

    it('initialises the table', (done) => {
      db.serialize(() => {
        db.get('SELECT name FROM sqlite_master WHERE type=? AND name=?;', 
          ['table', 'bottlecount'], (err, row) => {
            expect(err).toBe(null);
            expect(row.name).toBe('bottlecount');
            done();
        });
      });
    });

    it('puts and gets new bottle count data', (done) => {
      var timestamp1 = new Date('2012-02-22');
      var timestamp2 = new Date('2014-04-04T13:37:20');
      bottleCountDao.put({timestamp: timestamp1});
      bottleCountDao.put({timestamp: timestamp2});
      bottleCountDao.getAll().then((bottleCounts) => {
        expect(bottleCounts[0].timestamp).toEqual(timestamp1);
        expect(bottleCounts[1].timestamp).toEqual(timestamp2);
        done();
      }).catch((err) => {
        fail(err);
        done();
      });
    });
  });
});