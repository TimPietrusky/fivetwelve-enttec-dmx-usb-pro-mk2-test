let fivetwelve = require('fivetwelve/es5');
let EnttecUsbDmxProDriver = require('fivetwelve-driver-usbpro/es5');
let Serialport = require('serialport');
let randomColor = require('random-color');

const usbProSerialport = new Serialport('/dev/cu.usbserial-EN193448');
const driver = new EnttecUsbDmxProDriver.default(usbProSerialport);
const output = fivetwelve.default(driver, 2);

// Cameo FLAT PAR 1 RGBW
const device1 = new fivetwelve.DmxDevice({
  universe: 1,
  address: 100,
  params: {
    dimmer: new fivetwelve.param.RangeParam(1),
    strobe: new fivetwelve.param.RangeParam(2, { min: 0, max: 255 }),
    color: new fivetwelve.param.RgbParam([3, 4, 5]),
    white : new fivetwelve.param.RangeParam(6, { min: 0, max: 255 })
  }
});

const device2 = new fivetwelve.DmxDevice({
  universe: 2,
  address: 100,
  params: {
    dimmer: new fivetwelve.param.RangeParam(1),
    strobe: new fivetwelve.param.RangeParam(2, { min: 0, max: 255 }),
    color: new fivetwelve.param.RgbParam([3, 4, 5]),
    white : new fivetwelve.param.RangeParam(6, { min: 0, max: 255 })
  }
});

let dimmer = 1;

// connect the device to the dmx-output
device1.setOutput(output);

device1.dimmer = dimmer;
device1.strobe = 0;
device1.color = 'rgb(0, 0, 0)';
device1.white = 0;

// connect the device to the dmx-output
device2.setOutput(output);

device2.dimmer = dimmer;
device2.strobe = 0;
device2.color = 'rgb(0, 0, 0)';
device2.white = 0;


// Animation loop
output.requestDmxFrame(function loop(time) {

  device1.color = randomColor().rgbString();
  device2.color = randomColor().rgbString();

  // register the loop-function again for the next frame
  output.requestDmxFrame(loop);
});

// fps
output.start(1000 / 10);
