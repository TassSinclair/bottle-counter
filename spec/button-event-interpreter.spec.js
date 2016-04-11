'use strict';

var ButtonEventInterpreter = require('../src/button-event-interpreter');

describe('ButtonEventInterpreter', () => {

  var buttonEventInterpreter, bottleCounter;

  beforeEach(() => {
    jasmine.clock().install();
    bottleCounter = {
      bottleOpened: jasmine.createSpy('bottleOpened')
    };
    buttonEventInterpreter = new ButtonEventInterpreter(bottleCounter);
  });

  it('triggers a bottle opened event when there is no cooldown', () => {
    buttonEventInterpreter.buttonUp();

    expect(bottleCounter.bottleOpened.calls.count()).toBe(1);
  });

  it('resists multiple button up events when there is a cooldown', () => {
    buttonEventInterpreter.buttonUp();
    jasmine.clock().tick(2500);
    buttonEventInterpreter.buttonUp();
    jasmine.clock().tick(2500);
    buttonEventInterpreter.buttonUp();

    expect(bottleCounter.bottleOpened.calls.count()).toBe(1);
  });

  it('allows multiple button up events when waiting until after the cooldown', () => {
    buttonEventInterpreter.buttonUp();
    jasmine.clock().tick(3500);
    buttonEventInterpreter.buttonUp();

    expect(bottleCounter.bottleOpened.calls.count()).toBe(2);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
});