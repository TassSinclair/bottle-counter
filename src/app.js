'use strict';

const config = require('./config.js'),
      five = require('johnny-five'),
      raspi = require('raspi-io'),
      BottleCounter = require('./bottle-counter.js'),
      data = require('./data.js');

var board = new five.Board({
  io: new raspi()
});

var bottleCounter = new BottleCounter(data.eventRepository);

board.on('ready', () => {
  console.log('board.ready');

  var button = new five.Button({
    board: board,
    pin: config.buttonPin
  });

  button.on('up', () => {
    console.log('button.up');
    bottleCounter.bottleOpened();
  });

  this.repl.inject({
    button: button
  });

});
