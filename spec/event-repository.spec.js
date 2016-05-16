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

    it('gets event data', (done) => {
      var timestamp1 = new Date('2012-02-22');
      var timestamp2 = new Date('2014-04-04T13:37:20');
      eventRepository.put({type: 'type-1', timestamp: timestamp1});
      eventRepository.put({type: 'type-2', timestamp: timestamp1});
      eventRepository.put({type: 'type-1', timestamp: timestamp2});
      eventRepository.getAll('type-1').then((events) => {
        expect(events[0]).toEqual({type: 'type-1', timestamp: timestamp1});
        expect(events[1]).toEqual({type: 'type-1', timestamp: timestamp2});
        done();
      }).catch((err) => {
        fail(err);
        done();
      });
    });

    it('gets event data since a given date', (done) => {
      var timestamp1 = new Date('2012-02-22');
      var timestamp2 = new Date('2014-04-04T13:37:20');
      var timestamp3 = new Date('2016-04-04T13:37:20');
      eventRepository.put({type: 'type-1', timestamp: timestamp1});
      eventRepository.put({type: 'type-2', timestamp: timestamp2});
      eventRepository.put({type: 'type-1', timestamp: timestamp2});
      eventRepository.put({type: 'type-1', timestamp: timestamp3});
      eventRepository.getSince('type-1', timestamp2).then((events) => {
        expect(events[0]).toEqual({type: 'type-1', timestamp: timestamp2});
        expect(events[1]).toEqual({type: 'type-1', timestamp: timestamp3});
        done();
      }).catch((err) => {
        fail(err);
        done();
      });
    });
  });
});