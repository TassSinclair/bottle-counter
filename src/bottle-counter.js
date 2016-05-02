'use strict';
var events = require('events');

class BottleCounter extends events.EventEmitter {

  constructor(eventRepository) {
  	super();
  	this.eventRepository = eventRepository;
    this.eventRepository.getAll().then((events) => {
      this.currentCount = events.length;
    });
  }

  bottleOpened() {
  	this.currentCount++;

    this.eventRepository.put({
    	type: 'bottleOpened',
    	timestamp: new Date()
    });

    this.emit('countUpdate', this.currentCount);
  }
}

module.exports = BottleCounter;