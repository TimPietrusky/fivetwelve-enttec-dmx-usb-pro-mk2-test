let fivetwelve = require('fivetwelve/es5');
let fivetwelve_driver_usbpro = require('fivetwelve-driver-usbpro/es5');
import randomColor from 'random-color';

let Serialport = require('serialport');
if (process.env.NODE_ENV == 'development') {
  Serialport = require('virtual-serialport');
}

// Load devices
import CameoFlat1RGBW from './device/CameoFlat1RGBW';
import CameoPixBar600PRO from './device/CameoPixBar600PRO';



// Serial connection (USB) to Enttec DMX USB PRO Mk2
const usbProSerialport = new Serialport('/dev/cu.usbserial-EN193448');

// Initialize the driver using the serial connection
const driver = new fivetwelve_driver_usbpro(usbProSerialport);

// Create the output using the driver and initialize 2 universes
const output = fivetwelve.default(driver, 2);




let fps = 1;


// // Create the DMX devices and set the basic configuration
const device1 = new CameoFlat1RGBW({ universe : 1, address: 100 });
const device2 = new CameoFlat1RGBW({ universe : 2, address: 100 });

const pixbar = new CameoPixBar600PRO({ universe: 1, address: 13 });



// Connect the devices to the DMX output
device1.setOutput(output);
device2.setOutput(output);
pixbar.setOutput(output);


let dimmer = 0;

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

let pixbar_active = 1;
let pixbar_animation_color = [255, 0, 0];

// Animation loop
output.requestDmxFrame(function loop(time) {

  // Set a random color for each device
  device1.color = randomColor().rgbString();
  device2.color = randomColor().rgbString();

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
