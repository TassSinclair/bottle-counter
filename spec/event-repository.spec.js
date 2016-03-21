'use strict';

var EventRepository = require('../src/event-repository'),
    sqlite3 = require('sqlite3').verbose();

describe('EventRepository', () => {

  describe('interacting with a fresh database', () => {
    var eventRepository, db;

    beforeEach(() => {
      db = new sqlite3.Database(':memory:');
      eventRepository = new EventRepository(db);
    });

    it('initialises the table', (done) => {
      db.serialize(() => {
        db.get('SELECT name FROM sqlite_master WHERE type=? AND name=?;', 
          ['table', 'event'], (err, row) => {
            expect(err).toBe(null);
            expect(row.name).toBe('event');
            done();
        });
      });
    });

    it('puts and gets new event data', (done) => {
      var timestamp1 = new Date('2012-02-22');
      var timestamp2 = new Date('2014-04-04T13:37:20');
      eventRepository.put({type: 'type-1', timestamp: timestamp1});
      eventRepository.put({type: 'type-2', timestamp: timestamp2});
      eventRepository.getAll().then((events) => {
        expect(events[0]).toEqual({type: 'type-1', timestamp: timestamp1});
        expect(events[1]).toEqual({type: 'type-2', timestamp: timestamp2});
        done();
      }).catch((err) => {
        fail(err);
        done();
      });
    });
  });
});