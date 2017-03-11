/**
 * A fivetwelve-driver that uses a node-dmx instance to send data.
 * It is assumed that fivetwelve will have full control over the node-dmx
 * instance, concurrent changes via the node-dmx interface are not supported
 * and probably wont do anything useful.
 *
 * @example
 *     import fivetwelve from 'fivetwelve';
 *     import DMX from 'dmx';
 *
 *     const nodeDmx = new DMX();
 *     nodeDmx.addUniverse('universe1', 'enttec-usb-dmx-pro', '/dev/XXX');
 *     nodeDmx.addUniverse('universe2', 'enttec-usb-dmx-pro', '/dev/YYY');
 *
 *     const output = fivetwelve(new NodeDmxDriver(nodeDmx, {
 *       1: 'universe1',
 *       2: 'universe2'
 *     }));
 */
class NodeDmxDriver {
  /**
   * @param {object} nodeDmx the node-dmx instance.
   * @param {object} universeNameMapping a mapping of node-dmx universe names to
   *     (1-based) universe-numbers as used in the fivetwelve-library.
   */
  constructor(nodeDmx, universeNameMapping = null) {
    this.nodeDmx = nodeDmx;
    this.universeNameMapping = universeNameMapping;
  }

  send(buffer, universe) {

    universe = 1;

    const universeName = this.universeNameMapping[universe];
    const driver = this.nodeDmx.universes[universeName];

    // this is a bit hacky, but way more performant than any other way.
    buffer.copy(driver.universe);
    driver.send_universe();
  }
}

module.exports = NodeDmxDriver;
