let fivetwelve = require('fivetwelve/es5');
let DMX = require('DMX');
let fivetwelveNodeDmxDriver = require('./NodeDmxDriver');


const nodeDmx = new DMX();
nodeDmx.addUniverse('universe1', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN193448');
//nodeDmx.addUniverse('universe2', 'enttec-usb-dmx-pro', '/dev/cu.usbserial-EN193448');


const output = fivetwelve.default(new fivetwelveNodeDmxDriver(nodeDmx, {
  1: 'universe1',
  //2: 'universe2'
}));


output.start(30);

/*
 * dimmer
 * strobe
 * red
 * green
 * blue
 * white
 */
const device = new fivetwelve.DmxDevice(100, {
  dimmer: new fivetwelve.param.RangeParam(1),
  strobe: new fivetwelve.param.RangeParam(2, { min: 0, max: 255 }),
  color: new fivetwelve.param.RgbParam([3, 4, 5]),
  white : new fivetwelve.param.RangeParam(6, { min: 0, max: 255 })
});


// connect the device to the dmx-output
device.setOutput(output);

// set some values
device.dimmer = 1;
device.strobe = 0;
device.color = 'rgb(255, 50, 0)';
device.white = 50;
