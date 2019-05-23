'use strict';

var connectionString = 'HostName=cafu-iot.azure-devices.net;DeviceId=CafuDevice05;SharedAccessKey=uddVA+o0kA4dPdhSJBOCZvpQCbTfJCppxb/4RBQ96zQ=';

var Sensor = require("./../simulated-device-app/Sensor").Sensor;
var Azure = require("./../simulated-device-app").Azure;
var az = new Azure(connectionString);

setInterval(function(){
  var sensor = new Sensor({temperature: 20 + (Math.random() * 15), humidity: 60 + (Math.random() * 20)})
  var message = new az.Message(sensor.toJSON());

  message.properties.add('temperatureAlert', (sensor.temperature > 30) ? 'true' : 'false');

  console.log('Sending message: ' + message.getData());

  // Send the message.
  az.client.sendEvent(message, function (err) {
    if (err) {
      console.error('send error: ' + err.toString());
    } else {
      console.log('message sent');
    }
  });
}, 38000);
