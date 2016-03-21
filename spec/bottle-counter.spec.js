'use strict';

var BottleCounter = require('../src/bottle-counter');

describe('BottleCounter', () => {

  var bottleCounter, eventRepository;

  beforeEach(() => {
    jasmine.clock().install();
    eventRepository = {
      put: jasmine.createSpy('put')
    };
    bottleCounter = new BottleCounter(eventRepository);
  });

  it('saves a bottle count object when a bottle is opened', () => {
    var timestamp = new Date('2012-02-11');
    jasmine.clock().mockDate(timestamp);

    bottleCounter.bottleOpened();

    expect(eventRepository.put.calls.count()).toBe(1);

    expect(eventRepository.put.calls.argsFor(0)[0])
      .toEqual({type: 'bottleOpened', timestamp: timestamp});
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
});