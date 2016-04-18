'use strict';

const config = require('./config.js'),
      five = require('johnny-five'),
      raspi = require('raspi-io'),
      BottleCounter = require('./bottle-counter.js'),
      ButtonEventInterpreter = require('./button-event-interpreter.js'),
      data = require('./data.js');

var board = new five.Board({
  io: new raspi()
});

var bottleCounter = new BottleCounter(data.eventRepository);
var buttonEventInterpreter = new ButtonEventInterpreter(bottleCounter);

board.on('ready', function() {

  var button = new five.Button({
    board: board,
    pin: config.buttonPin
  });

  button.on('up', () => buttonEventInterpreter.buttonUp());

  this.repl.inject({
    button: button
  });

});
