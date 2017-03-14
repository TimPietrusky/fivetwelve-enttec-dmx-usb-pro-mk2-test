let fivetwelve = require('fivetwelve/es5');
let EnttecUsbDmxProDriver = require('fivetwelve-driver-usbpro/es5');
let Serialport = require('serialport');

const usbProSerialport = new Serialport('/dev/cu.usbserial-EN193448');
const driver = new EnttecUsbDmxProDriver.default(usbProSerialport, {
  universeMapping : {
    1: 'universe1',
    2: 'universe2'
  }
});

const output = fivetwelve.default(driver, 2);

// 30 fps
output.start(30);

 // Cameo FLAT PAR 1 RGBW
const device = new fivetwelve.DmxDevice(1, {
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

console.log(output.getBuffer(1));
