const models = require('./../models').models;
const lodash = require("lodash");
module.exports.index = function(req, res) {
  return res.render('home/index')
}
