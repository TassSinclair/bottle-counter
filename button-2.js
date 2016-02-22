var raspi = require('raspi-io');
var five = require('johnny-five');
var button;

var board = new five.Board({
  io: new raspi()
});

board.on('ready', function() {

  button = new five.Button({
	pin: 'GPIO17',
//	isPullUp: false
	});


  button.on("down", function() {
    console.log("down");
  });

  // "hold" the button is pressed for specified time.
  //        defaults to 500ms (1/2 second)
  //        set
  button.on("hold", function() {
    console.log("hold");
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
  });

});
