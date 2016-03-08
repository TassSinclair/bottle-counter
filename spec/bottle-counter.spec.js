'use strict';

var BottleCounter = require('../src/bottle-counter');

describe('BottleCounter', () => {

  var bottleCounter, bottleCountDao;

  beforeEach(() => {
    jasmine.clock().install();
    bottleCountDao = {
      put: jasmine.createSpy('put')
    };
    bottleCounter = new BottleCounter(bottleCountDao);
  });

  it('saves a bottle count object when a bottle is opened', () => {
    var timestamp = new Date('2012-02-11');
    jasmine.clock().mockDate(timestamp);

    bottleCounter.bottleOpened();

    expect(bottleCountDao.put.calls.count()).toBe(1);

    expect(bottleCountDao.put.calls.argsFor(0)[0]).toEqual({timestamp: timestamp});
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
});