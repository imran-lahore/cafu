var connectionString = 'HostName=cafu-iot.azure-devices.net;DeviceId=CafuDevice03;SharedAccessKey=nLztfmUnD4SkyfKMJAXwh7MxwdB9eZhy1CpF8a2sTkU=';

var Sensor = require("./../simulated-device-app/Sensor").Sensor;
var Azure = require("./../simulated-device-app").Azure;
var az = new Azure(connectionString);

setInterval(function(){
  var sensor = new Sensor({co2EmissionLVL: 250 + (Math.random() * 100)})
  var message = new az.Message(sensor.toJSON());

  message.properties.add('emissionAlert', (sensor.co2EmissionLvl > 300) ? 'true' : 'false');

  console.log('Sending message: ' + message.getData());

  // Send the message.
  az.client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
}, 32000);
