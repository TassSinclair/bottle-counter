'use strict';

const config = require('./config.js'),
      five = require('johnny-five'),
      raspi = require('raspi-io'),
      BottleCounter = require('./bottle-counter.js'),
      ButtonEventInterpreter = require('./button-event-interpreter.js'),
      data = require('./data.js'),
      HttpServer = require('./http.js');

var board = new five.Board({
  io: new raspi()
});

var hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

function addBottleOpened(timestamp) {
  data.eventRepository.put({type:'bottleOpened', timestamp: new Date(timestamp)});  
}

var date = new Date();
for (var i = 0; i < 14; date.setDate(date.getDate() - 1) && ++i) {
  for(var k = parseInt(Math.random() * 30); k > 0; --k) {
    addBottleOpened(date.toISOString().slice(0,11) + hours[parseInt(Math.random() * 24)] + date.toISOString().slice(13));
  }
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
