var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  console.log("Ready event. Repl instance auto-initialized!");

  var led13 = new five.Led(13);
  var led12 = new five.Led(12);
  var led11 = new five.Led(11);
  var positivo = new five.Led(7);
  var array = new five.Leds([11, 12, 13]);
  var servo = new five.Servo(10);


  var timing = 250;
  var randomFade = false;
  var fadeIndex = 0;
  var ledCount = array.length;
  var i;

  this.on("exit", function() {
    led13.off();
    led11.off();
    led12.off();
    positivo.off();
  });

  this.repl.inject({
    // Allow limited on/off control access to the
    // Led instance from the REPL.
    on13: function() {
      led13.on();
    },
    servo: function(){
      positivo.on();
      servo.sweep();
    },
    off13: function() {
      led13.off();
    },
    on12: function() {
      led12.on();
    },
    off12: function() {
      led12.off();
    },
    blink: function(){
      board.repl.context.on13();
      led12.blink(500);
    },
    pulse: function(){
      board.repl.context.blink();
      led11.pulse({
        easing: "linear",
        duration: 3000,
        cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
        keyFrames: [0, 10, 0, 50, 0, 255],
        onstop: function() {
          console.log("Animation stopped");
        }
      });
    },
    rotateCB: function(n){
      n -= 1;
      led13.fadeIn();
      board.wait(500, function() {
        led13.fadeOut();
        led12.fadeIn();
        board.wait(500, function() {
          led12.fadeOut();
          led11.fadeIn();
          board.wait(500, function() {
            led11.fadeOut();
          });
        });
      });
      if(n>0)
        board.repl.context.rotateCB(n);
    },
    arrayPulse: function(){
      array.pulse();
    },
    blinkFunction: function(n){
      blink12(n);
    },
    aleatorio: function(){
      array.on();
      array[fadeIndex].fadeOut(timing, fadeNext);
    },
    rotateInfError: function(){
      var i=0;
      while(i<10000){
        board.wait(1500, function(){board.repl.context.rotateCB();});
      }
    },
    rotateRobando: function(){
      led13.fadeIn(1500);
      console.log('ligou 13');
      led13.fadeOut(1500, null);
      led12.fadeIn(1500);
      console.log('ligou 12');
      led12.fadeOut(1500, null);
      led11.fadeIn(1500);
      console.log('ligou 11');
      led11.fadeOut(1500, null);
    },
    controlServo: function(){
      console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");


      //var servo = new five.Servo.Continuous(7); O servo preto não é continuous
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.setRawMode(true);
      process.stdin.on("keypress", function(ch, key) {
        if (!key) {
          return;
        }

        if (key.name === "q") {
          console.log("Quitting");
          process.exit();
        } else if (key.name === "up") {
          console.log("CW");
          //servo.cw();
          positivo.on();
        } else if (key.name === "down") {
          console.log("CCW");
          //servo.ccw();
          positivo.off();
        } else if (key.name === "space") {
          console.log("Stopping");
          servo.stop();
        }
      });
    }
  });





// -----------------------------------------Subrotinas-------------------------------------------
function blink12(ms){
 led12.blink(ms)
}
function wait(ms){
  'use strict';
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
   end = new Date().getTime();
 }
}
function fadeNext() {
  var candidateIndex = fadeIndex;
  array[fadeIndex].fadeIn(timing);

    // Determine the next LED to fade
    if (randomFade) {
      while (candidateIndex === fadeIndex) {
        candidateIndex = Math.round(Math.random() * (ledCount - 1));
      }
    } else {
      candidateIndex = (++fadeIndex) % array.length;
    }
    fadeIndex = candidateIndex;

    array[fadeIndex].fadeOut(timing, fadeNext);
  }

});





