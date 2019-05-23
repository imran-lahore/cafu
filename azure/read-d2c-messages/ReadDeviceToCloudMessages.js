'use strict';

var connectionString = 'HostName=cafu-iot.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=eaG2z7KONA0SHv0I9ymMSlTEIjEInCp6p1Imedmpev0='
var models = require('./app/models').models;
var { EventHubClient, EventPosition } = require('@azure/event-hubs');
var lodash = require('lodash');
var WebSocket = require('ws');
var printError = function (err) {
  console.log(err.message);
};

var ws = new WebSocket.Server({ port: 8000 });
var CLIENTS = new Array();
ws.on("connection", function connection(soc) {
  CLIENTS.push(soc);
  soc.on('message', function incoming(message){
    console.log('Received: %s', message);
  })
});
var ehClient;
function initEvent() {

  var printMessage = function (message) {
    const device = new models.Device({
      deviceId: message.annotations["iothub-connection-device-id"],
      data: lodash.merge(message.body, message.applicationProperties),
    });
    device.save(function(err, dvce) {
      if(err){
      } else {
        for (var i=0; i<CLIENTS.length; i++) {
          CLIENTS[i].send(JSON.stringify(dvce));
        }
      }
    });
  };
  EventHubClient.createFromIotHubConnectionString(connectionString).then(function (client) {
    console.log("Successully created the EventHub Client from iothub connection string.");
    ehClient = client;
    return ehClient.getPartitionIds();
  }).then(function (ids) {
    console.log("The partition ids are: ", ids);
    return ids.map(function (id) {
      return ehClient.receive(id, printMessage, printError, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
    });
  }).catch(printError);
}

module.exports.initEvent = initEvent;
