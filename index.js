const spawn = require('spawn');
let Service, Characteristic, UUIDGen;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  UUIDGen = homebridge.hap.uuid;
  homebridge.registerPlatform("homebridge-cec", "TV", CEC);
}

class CEC{
  constructor(log, config, api){
    this.log = log;
    this.config = config;

    this.service = new Service.Switch(this.name);

    this.service
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPower.bind(this));
      .on('get', this.getPower.bind(this));
  }

  setPower(on, cb) {
    const cmd = on ? 'on' : 'standby';
    exec(`echo "${cmd} 0" | cec-client -s`, (err, stdout, stderr) => {
      if (err !== null) {
        console.log('exec error: ' + error);
      }
      cb(null, on);
    });
  },

  getPower(on, cb) {
    exec(`echo "pow 0" | cec-client -s`, (err, stdout, stderr) => {
      if (err !== null) {
        console.log('exec error: ' + error);
      }
      let n = stdout.indexOf("power status:");
      status_temp = stdout.substring(n+13, n+28);
      status = status_temp.substring(0, status_temp.indexOf("D")-1);      
      res.render(null, status === 'on');
    });
  },

  getServices() {
    return [this.service];
  }
}