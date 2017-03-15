let fivetwelve = require('fivetwelve/es5');
let fivetwelve_driver_usbpro = require('fivetwelve-driver-usbpro/es5');
let Serialport = require('serialport');
let randomColor = require('random-color');


// Serial connection to Enttec DMX USB PRO Mk2
const usbProSerialport = new Serialport('/dev/cu.usbserial-EN193448');

// Initialize the driver using the serial connection
const driver = new fivetwelve_driver_usbpro(usbProSerialport);

// Create the output using the driver and initialize 2 universes
const output = fivetwelve.default(driver, 2);



// Create a default configuration for the DMX devices
const cameo_flat_led_par = {
    dimmer: new fivetwelve.param.RangeParam(1),
    strobe: new fivetwelve.param.RangeParam(2, { min: 0, max: 255 }),
    color: new fivetwelve.param.RgbParam([3, 4, 5]),
    white : new fivetwelve.param.RangeParam(6, { min: 0, max: 255 })
};



// Create the DMX devices by using the default configuration
const device1 = new fivetwelve.DmxDevice({
  universe: 1,
  address: 100,
  params: cameo_flat_led_par
});

const device2 = new fivetwelve.DmxDevice({
  universe: 2,
  address: 100,
  params: cameo_flat_led_par
});



// Connect the devices to the DMX output
device1.setOutput(output);
device2.setOutput(output);



let dimmer = 1;

// Set initial values for the devices
device1.dimmer = dimmer;
device1.strobe = 0;
device1.color = 'rgb(0, 0, 0)';
device1.white = 0;

device2.dimmer = dimmer;
device2.strobe = 0;
device2.color = 'rgb(0, 0, 0)';
device2.white = 0;



// Animation loop
output.requestDmxFrame(function loop(time) {

  // Set a random color for each device
  device1.color = randomColor().rgbString();
  device2.color = randomColor().rgbString();

  // Recursion
  output.requestDmxFrame(loop);
});



// Start the DMX output with the specified fps
output.start(1000 / 1);
