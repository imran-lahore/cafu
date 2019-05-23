const models = require('./../models').models;

module.exports.index = function(req, res) {
  models.Device.find().sort({createdAt: -1}).exec(function(err, devices) {
    if (err) {
      return res.status(400).json({error: err});
    }
    return res.status(200).json({
      devices: devices
    });
  })
}
