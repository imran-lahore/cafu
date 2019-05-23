var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client
var Message = require('azure-iot-device').Message;


function Azure(connectionString) {
  this.client = DeviceClient.fromConnectionString(connectionString, Mqtt);
  this.Message = Message;
}


module.exports.Azure = Azure;
