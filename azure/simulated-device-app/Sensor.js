function Sensor(attrs) {
  this.attrs = attrs;
  for (attr in attrs) {
    this[attr] = attrs[attr];
  }
}
Sensor.prototype.toJSON = function () {
  var arrList = {};
  for (attr in this.attrs) {
   arrList[attr] = this[attr];
  }
  return JSON.stringify(arrList);
}

module.exports.Sensor = Sensor;
