let fivetwelve = require('fivetwelve/es5');
let DMX = require('DMX');
let fivetwelveNodeDmxDriver = require('./NodeDmxDriver');

// Create a connection to "enttec USB DMX Pro Mk2" by using node-dmx and add 2 universes
const nodeDmx = new DMX();
nodeDmx.addUniverse('universe1', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN193448');
nodeDmx.addUniverse('universe2', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN193448');

// Connect node-dmx to fivetwelve
const output = fivetwelve.default(new fivetwelveNodeDmxDriver(nodeDmx, {
  1: 'universe1',
  2: 'universe2'
}));

// 30 fps
output.start(30);

 // Cameo FLAT PAR 1 RGBW
const device = new fivetwelve.DmxDevice(100, {
  dimmer: new fivetwelve.param.RangeParam(1),
  strobe: new fivetwelve.param.RangeParam(2, { min: 0, max: 255 }),
  color: new fivetwelve.param.RgbParam([3, 4, 5]),
  white : new fivetwelve.param.RangeParam(6, { min: 0, max: 255 })
});


// connect the device to the dmx-output
device.setOutput(output);

// BURN BABY, BURN
device.dimmer = 1;
device.strobe = 0;
device.color = 'rgb(255, 50, 0)';
device.white = 50;
