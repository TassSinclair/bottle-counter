var raspi = require('raspi-io');
var five = require("johnny-five");

var board = new five.Board({
  io: new raspi()
});

board.on("ready", function() {

  // Create a new `button` hardware instance.
  var button = new five.Button({
	board: board,
	pin: 'GPIO4',
	holdtime: 1000,
	invert: true
  });

  button.on("down", function() {
    console.log( "Button down" );
  });

  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("up", function() {
    console.log( "Button up" );
  });
});
