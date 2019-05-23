const DeviceController = require("./../controllers/DeviceController");
const HomeController = require('./../controllers/HomeController');

module.exports = function(express) {
  const router = express.Router();
  router.get("/devices", DeviceController.index);
  router.get("/", HomeController.index);

  return router;
}
