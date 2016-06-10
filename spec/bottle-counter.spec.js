'use strict';

const BottleCounter = require('../src/bottle-counter');
const q = require('q');

describe('BottleCounter', () => {

  var bottleCounter, eventRepository;
  var events = [
    {type: 'bottleOpened', timestamp: new Date()},
    {type: 'bottleOpened', timestamp: new Date()}
  ];
  var getAllCallback = { then: (callback) => callback(events) };
  var getSincePromise = q.when();

  beforeEach(() => {
    jasmine.clock().install();
    eventRepository = {
      put: jasmine.createSpy('put'),
      getAll: jasmine.createSpy('getAll').and.returnValue(getAllCallback),
      getSince: jasmine.createSpy('getSince').and.returnValue(getSincePromise)
    };
    bottleCounter = new BottleCounter(eventRepository);
  });

  it('initialises the currentCount based on the number of events recorded', () => {
    expect(eventRepository.getAll.calls.argsFor(0)[0]).toEqual('bottleOpened');
    expect(bottleCounter.currentCount).toBe(2);
  });

  it('saves a bottle count object when a bottle is opened', () => {
    var timestamp = new Date('2012-02-11');
    jasmine.clock().mockDate(timestamp);

    bottleCounter.bottleOpened();

    expect(eventRepository.put.calls.count()).toBe(1);

    expect(eventRepository.put.calls.argsFor(0)[0])
      .toEqual({type: 'bottleOpened', timestamp: timestamp});
  });

  it('gets all bottle opened counts since a given date', () => {
    var date = new Date();
    expect(bottleCounter.getSince(date)).toBe(getSincePromise);
    expect(eventRepository.getSince.calls.argsFor(0)).toEqual(['bottleOpened', date]);
  });

  it('increments the currentCount when a bottle is opened', () => {
    var initialCurrentCount = bottleCounter.currentCount;
    bottleCounter.bottleOpened();

    expect(bottleCounter.currentCount).toBe(initialCurrentCount + 1);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
});