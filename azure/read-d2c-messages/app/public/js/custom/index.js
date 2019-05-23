function prepend(value, array) {
  var newArray = array.slice();
  newArray.unshift(value);
  return newArray;
}
var Device = function(deviceId, data, createdAt) {
  this.deviceId = deviceId;
  this.data = data;
  this.createdAt = createdAt;
}
Device.prototype.currentDevice = function () {
  return {
    "CafuDevice01": { name: "Temperature Sensor 01", type: "temperature", site: "room 01", isCo2: false },
    "CafuDevice02": { name: "Temperature Sensor 02", type: "temperature", site: 'room 02', isCo2: false },
    "CafuDevice03": { name: "co2 sensor 01", type: "co2", site: "room 01", isCo2: true },
    'CafuDevice04': { name: 'co2 sensor 02', type: 'co2', site: 'room 02', isCo2: true },
    "CafuDevice05": { name: "Temperature Sensor 03", type: "temperature", site: "room 03", isCo2: false },
    }[this.deviceId];
}
Device.prototype.toView = function () {
  return {
    deviceId: this.deviceId,
    name: this.currentDevice().name,
    site: this.currentDevice().site,
    type: this.currentDevice().type,
    data: this.data,
    isCo2: this.currentDevice().isCo2,
  }
}
var DeviceViewAdapter = function(data, container) {
  this.$deviceViewContainer = container;
  this.devices = new Array();
  data.forEach((d, index) => {
    var device = new Device(d.deviceId, d.data, d.createdAt);
    this.devices.push(device);
  });
}
function merge_options(obj1,obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}
DeviceViewAdapter.prototype.toChartArray = function() {
  var chartArray = new Array();
  this.devices.forEach((d, index) => {
    (chartArray[d.deviceId] = chartArray[d.deviceId] || (new Array())).push(merge_options(d.data, {createdAt: d.createdAt}));
  })
  return chartArray;
}
DeviceViewAdapter.prototype.uniqueDevices = function() {
  var uniqueDevices = new Array();
  this.devices.forEach((d, index) => {
     if(!uniqueDevices[d.deviceId]) {
       uniqueDevices[d.deviceId] = d;
     }
  });
  return uniqueDevices;
}
DeviceViewAdapter.prototype.update = function(data) {
  var device = new Device(data.deviceId, data.data, data.createdAt);
  this.devices = prepend(device, da.devices);
  $("#"+device.deviceId).replaceWith(this.view(this.uniqueDevices()[device.deviceId]));
}
DeviceViewAdapter.prototype.index = function() {
  var html = new Array();
  for(var d in this.uniqueDevices()) {
    html.push(this.view(this.uniqueDevices()[d]));
  }
  this.$deviceViewContainer.html(html.join(""))
}
DeviceViewAdapter.prototype.view = function(device) {
  var source = $('#device-card').html();
  var template = Handlebars.compile(source);
  return template({device: device.toView()});
}

$(document).ready(function() {
  Handlebars.registerHelper('roundNumber', function(value) {
    return value.toFixed(2);
  });
  var $deviceViewContainer = $("[data-load-device-graphs]");
  if($("[data-load-device-graphs]").length) {
    var ws = new WebSocket("ws://35.163.170.59:8000/");

    ws.onopen = function() {
      console.log("connected!");
    }
    ws.onmessage = function (message) {
      var data = JSON.parse(message.data);
      da.update(data);
    }
    $.get("/devices", function(data) {
      if (data.devices) {
        window.da = new DeviceViewAdapter(data.devices, $deviceViewContainer);
        da.index();
      }
    });
  }
});
