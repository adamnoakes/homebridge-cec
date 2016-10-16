const exec = require('child_process').exec;
let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-cec", "TV", CEC);
}

class CEC{
  constructor(log, config, api){

    this.log = log;
    this.config = config;
    this.log('Creating TV CEC Accessory');
    this.service = new Service.Switch('TV');

    this.service
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPower.bind(this))
      .on('get', this.getPower.bind(this));
  }

  setPower(on, cb) {
    this.log(`Set power ${on}`);
    const cmd = on ? 'on' : 'standby';
    exec(`echo "${cmd} 0" | cec-client -s`, (err, stdout, stderr) => {
      if (err !== null) {
        this.log('exec error: ' + err);
      }
      cb(null, on);
    });
  }

  getPower(cb) {
    exec(`echo "pow 0" | cec-client -s`, (err, stdout, stderr) => {
      if (err !== null) {
        this.log('exec error: ' + err);
      }
      const n = stdout.indexOf("power status:");
      const status = stdout.substring(n+14, n+16);
      cb(null, status === 'on');
    });
}

  identify(callback) {
    this.log("Identify requested!");
    callback(); // success
  }

  getServices() {
    this.log("Get services");
    return [this.service];
  }
}
