'use strict';

class BottleCounter {

  constructor(eventRepository) {
  	this.eventRepository = eventRepository;
  }

  bottleOpened() {
    this.eventRepository.put({
    	type: 'bottleOpened',
    	timestamp: new Date()
    });
  }
}

module.exports = BottleCounter;