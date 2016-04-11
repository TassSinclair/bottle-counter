'use strict';

const BottleCounter = require('./bottle-counter.js');

class ButtonEventInterpreter {

	constructor(bottleCounter) {
		this.bottleCounter = bottleCounter;
		this.cooldownTimer = null;
	}

	buttonUp() {
		if (!this.cooldownTimer) {
			this.bottleCounter.bottleOpened();
		}
		this.startCooldown();
	}

	startCooldown() {
		clearTimeout(this.cooldownTimer);
		this.cooldownTimer = setTimeout(() => this.cooldownTimer = null, 3 * 1000);
	}
}

module.exports = ButtonEventInterpreter;