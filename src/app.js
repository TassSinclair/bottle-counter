'use strict';

const config = require('./config.js'),
      five = require('johnny-five'),
      raspi = require('raspi-io'),
      moment = require('moment'),
      BottleCounter = require('./bottle-counter.js'),
      ButtonEventInterpreter = require('./button-event-interpreter.js'),
      data = require('./data.js'),
      HttpServer = require('./http.js');

var board = new five.Board({
  io: new raspi()
});

if(config.isDev) {

  function addBottleOpened(timestamp) {
    data.eventRepository.put({type:'bottleOpened', timestamp: new Date(timestamp)});  
  }

  
  var now = moment();
  for (var i = 0; i < 30; ++i) {
    now = now.startOf('day').subtract(1, 'day');
    for (var j = 13; j < 23; ++j) {
      now = now.set('hour', j);
      addBottleOpened(now.toISOString());
    }
  }

  setInterval(function() {bottleCounter.bottleOpened(); }, 4000);
}

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

var server = new HttpServer(8080, bottleCounter);
server.start();
