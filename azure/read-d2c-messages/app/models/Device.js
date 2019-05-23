const mongoose = require('mongoose');

const deviceSchema =  new mongoose.Schema({
  deviceId: {
    type: String
  },
  data: {
    type: JSON,
  },
  deviceName: {
    type: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
