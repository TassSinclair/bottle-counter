'use strict';
const events = require('events');

class BottleCounter extends events.EventEmitter {

  constructor(eventRepository) {
  	super();
    this.eventName = 'bottleOpened';
  	this.eventRepository = eventRepository;
    this.eventRepository.getAll(this.eventName).then((events) => {
      this.currentCount = events.length;
    });
  }

  bottleOpened() {
  	this.currentCount++;

    this.eventRepository.put({
    	type: this.eventName,
    	timestamp: new Date()
    });

    this.emit('countUpdate', this.currentCount);
  }

  getSince(since) {
    return this.eventRepository.getSince(this.eventName, since);
  }
}

module.exports = BottleCounter;