'use strict';

class BottleCounter {

  constructor(bottleCountDao) {
  	this.bottleCountDao = bottleCountDao;
  }

  bottleOpened() {
    this.bottleCountDao.put({timestamp: new Date()});
  }
}

module.exports = BottleCounter;