/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */



//CHRIS'S NOTES :)
//controllers is a JSON object, accessed like controllers.
//ALSO, gamepad button objects have Boolean properties of touched or pressed
//and a final value property that is a from 0 to 1, and triggers can access the decimals between
//the <meter> DOM element takes a min, max, and value property.


var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var doesExist = false

//request animation frames
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

//adding to an array for gamepads
function connecthandler(e) {
  addgamepad(e.gamepad);
}

//FUNCTION--------------------------------ADD-GAMEPAD---------------------------------------

function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; 
  //creating a div that has an id that matches the number gamepad connected
  var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);

  //header that says controller inside div "d"
  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);

  //div with class for buttons
  var b = document.createElement("div");
  b.className = "buttons";

  // for loop to begin creating spans for every button on gamepad (gamepad.buttons.length)
  for (var i=0; i<gamepad.buttons.length; i++) {
    var e = document.createElement("span");
    e.className = "button";
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);

  //create div for axes
  var a = document.createElement("div");
  a.className = "axes";

  //for loop to create "meter" elements that reflect the number of axes accessible (joysticks)
  //also meter documentation: https://www.w3schools.com/tags/tag_meter.asp#:~:text=The%20tag%20defines%20a,as%20in%20a%20progress%20bar).
  for (i=0; i<gamepad.axes.length; i++) {
    e = document.createElement("meter");
    e.className = "axis";
    //e.id = "a" + i;

    //joystick axes work by an ideal 0 as center, and -1 and 1 as extremities
    e.setAttribute("min", "-1");
    e.setAttribute("max", "1");
    e.setAttribute("value", "0");
    e.innerHTML = i;
    a.appendChild(e);
  }
  d.appendChild(a);

  //hiding the start shit when page is interacted with
  document.getElementById("start").style.display = "none";
  //append everything
  document.body.appendChild(d);
  //callback (allows the page to update 60hz or fps based on refresh rate)
  rAF(updateStatus);
}

//FUNCTION--------------------------------DISCONNECT HANDLER---------------------------------------
//disconnecting the controller, and removing event handler

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

//FUNCTION--------------------------------REMOVE GAMEPAD---------------------------------------
//function that handles removal of controller

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

//FUNCTION--------------------------------UPDATE STATUS---------------------------------------
//updating the current state of controller

function updateStatus() {
  
  //see scangamepads()
  scangamepads();

  //for...in is a loop to iterate through JSON objects
  //my guess is that this is necessary for multiple controllers, so it can look through and update the status of all of them
  //just some preemptive damage control lmao
  for (j in controllers) {

    //targeting, accessing DOM elements
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");

    //for loop to iterate thru available buttons, targeting and value setting
    for (var i=0; i<controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];

      //easy if statement, if value is 1, 
      var pressed = val == 1.0;
      var touched = false;

      //if current button[i] in for loop is an object, set value of pressing, and if it has a property of touched, then set that to true (BOTH ARE BOOLEANS)
      if (typeof(val) == "object") {
        pressed = val.pressed;
        if ('touched' in val) {
          touched = val.touched;
        }

        //set value to current value of button object
        val = val.value;
      }

      //percentages for the value
      var pct = Math.round(val * 100) + "%";

      //css shit to handle visuals based on button input
      b.style.backgroundSize = pct + " " + pct;
      b.className = "button";
      if (pressed) {
        b.className += " pressed";
      }
      if (touched) {
        b.className += " touched";
      }
    }

    //accessing axes again
    var axes = d.getElementsByClassName("axis");

    //for loop to iterate through joystick axes
    for (var i=0; i<controller.axes.length; i++) {

      //here, the variable axes is the actual array taken of <meter> DOM elements, defined earlier
      //so for this loop, variable a will equal the current axis
      var a = axes[i];

      //toFixed limits the value to 4 decimal points
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);

      //set value of current axis <meter> DOM element to the value of actual current axis
      a.setAttribute("value", controller.axes[i]);
    }
  }
  //!!!all of my code is right here: take value from triggers, and use it for adjusting weight, italics, etc.
  if(doesExist){
  var affectedText = document.querySelector('.changeMe');
  affectedText.style.fontVariationSettings = "\"wght\" " + adjustWeight(controller.axes[1]) + ", \"ital\" " + adjustItalics(controller.axes[2]) + ", \"wdth\" " + adjustWidth(controller.axes[0]);
  affectedText.style.fontSize = adjustSize(controller.axes[3]) + "em";
  affectedText.style.letterSpacing = adjustSpacing(controller.buttons[7].value) + "em";
  affectedText.style.opacity = adjustOpacity(controller.buttons[6].value)

  }
  //callback
  rAF(updateStatus);
}


//FUNCTION--------------------------------SCAN GAMEPADS---------------------------------------
//scanning for amount of gamepads

function scangamepads() {

  //browser handling
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  
  //iterate through a generated array of gamepads
  for (var i = 0; i < gamepads.length; i++) {

    //if gamepads[i] exists and an in argument, is a this gamepads in controller object
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

//checking for events, adding event listeners based on browsers
if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}