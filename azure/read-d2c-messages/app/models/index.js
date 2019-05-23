const mongoose = require('mongoose');
const Device = require('./Device');


const connectDB = () => {
  return mongoose.connect(process.env.DATABASE_URL);
}

const models = { Device };

module.exports.connectDB = connectDB;
module.exports.models = models;
