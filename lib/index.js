'use strict';

var _randomColor = require('random-color');

var _randomColor2 = _interopRequireDefault(_randomColor);

var _CameoFlat1RGBW = require('./device/CameoFlat1RGBW');

var _CameoFlat1RGBW2 = _interopRequireDefault(_CameoFlat1RGBW);

var _CameoPixBar600PRO = require('./device/CameoPixBar600PRO');

var _CameoPixBar600PRO2 = _interopRequireDefault(_CameoPixBar600PRO);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fivetwelve = require('fivetwelve/es5');
var fivetwelve_driver_usbpro = require('fivetwelve-driver-usbpro/es5');


var Serialport = require('serialport');
if (process.env.NODE_ENV == 'development') {
  Serialport = require('virtual-serialport');
}

// Load devices


// Serial connection (USB) to Enttec DMX USB PRO Mk2
var usbProSerialport = new Serialport('/dev/cu.usbserial-EN193448');

// Initialize the driver using the serial connection
var driver = new fivetwelve_driver_usbpro(usbProSerialport);

// Create the output using the driver and initialize 2 universes
var output = fivetwelve.default(driver, 2);

var fps = 1;

// // Create the DMX devices and set the basic configuration
var device1 = new _CameoFlat1RGBW2.default({ universe: 1, address: 100 });
var device2 = new _CameoFlat1RGBW2.default({ universe: 2, address: 100 });

var pixbar = new _CameoPixBar600PRO2.default({ universe: 1, address: 13 });

// Connect the devices to the DMX output
device1.setOutput(output);
device2.setOutput(output);
pixbar.setOutput(output);

var dimmer = 0;

// Set initial values for the devices
device1.dimmer = dimmer;
device1.strobe = 0;
device1.color = 'rgb(0, 0, 0)';
device1.white = 0;

device2.dimmer = dimmer;
device2.strobe = 0;
device2.color = 'rgb(0, 0, 0)';
device2.white = 0;

pixbar.dimmer = 35;
pixbar.strobe = 0;

var pixbar_active = 1;
var pixbar_animation_color = [255, 0, 0];

// Animation loop
output.requestDmxFrame(function loop(time) {

  // Set a random color for each device
  device1.color = (0, _randomColor2.default)().rgbString();
  device2.color = (0, _randomColor2.default)().rgbString();

  for (var i = 1; i <= 12; i++) {
    pixbar['led' + i].rgbwauv = [0, 0, 0, 0, 0, 255];

    if (i === pixbar_active) {
      pixbar['led' + i].rgbwauv = [pixbar_animation_color[0], pixbar_animation_color[1], pixbar_animation_color[2], 0, 0, 0];
    }
  }

  if (pixbar_active >= 12) {
    pixbar_active = 0;
  }

  pixbar_active++;

  // Recursion
  output.requestDmxFrame(loop);
});

// Start the DMX output with the specified fps
output.start(1000 / fps);

console.log("Started in", process.env.NODE_ENV, "mode with", fps, "fps");