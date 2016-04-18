'use strict';

class BottleCounter {

  constructor(eventRepository) {
  	this.eventRepository = eventRepository;
  	this.currentCount = 0;
  }

  bottleOpened() {
  	this.currentCount++;

    this.eventRepository.put({
    	type: 'bottleOpened',
    	timestamp: new Date()
    });
  }
}

module.exports = BottleCounter;