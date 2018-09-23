var express = require('express');
var router = express.Router();
var smartcar = require("../lib/smartcar");
const models = require('../models/user.model');

router.get('/', function(req, res, next) {
  var car_name = req.query.car;
  var mode = req.query.mode;

  models.get_car_from_user('owner', car_name, function(car) {
    var data = {car: car};

    if (!mode) {
      res.render('lock', data);
    } else {
      var lock_vehicle = function(vehicle) {
        console.log("###vehicle: " + JSON.stringify(vehicle));
        smartcar.lock_vehicle(vehicle, function(lock_res) {
          console.log("###lock_res: " + JSON.stringify(lock_res));
          if (!lock_res) {
            data["status_msg"] = "Lock request sent";
          } else {
            data["status_msg"] = "Lock request failed";
          }
          res.render('lock', data);
        });
      };

      var unlock_vehicle = function(vehicle) {
        console.log("###vehicle: " + JSON.stringify(vehicle));
        smartcar.unlock_vehicle(vehicle, function(lock_res) {
          console.log("###lock_res: " + JSON.stringify(lock_res));
          if (!lock_res) {
            data["status_msg"] = "Unlock request sent";
          } else {
            data["status_msg"] = "Unlock request failed";
          }
          res.render('lock', data);
        });     
      };

      smartcar.get_credentials('owner', function(credentials) {
        if (!credentials) {
          const message = "Not authorized";
          const action = "";
          return redirectToError(res, message, action);
        } else {
          var vehicle = smartcar.get_vehicle(credentials.accessToken, car.smartcar_id);

          if (mode == "lock") {
            lock_vehicle(vehicle);
          } else {
            unlock_vehicle(vehicle);
          }
        }
      });
    }
  });
});

module.exports = router;