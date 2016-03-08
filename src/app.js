'use strict';

const config = require('./config.js'),
      five = require('johnny-five'),
      raspi = require('raspi-io'),
      BottleCounter = require('./bottle-counter.js'),
      data = require('./data.js');

var board = new five.Board({
  io: new raspi()
});
var bottleCounter = new BottleCounter(data.bottleCountDao);
bottleCounter.bottleOpened();
board.on('ready', function() {

  console.log('board.ready');
  var counter = new Counter();

  var button = new five.Button({
    board: board,
    pin: config.buttonPin,
	});

  button.on('up', function() {
    console.log('button.up');
    counter.count();
  });

  this.repl.inject({
    button: button
  });

});
