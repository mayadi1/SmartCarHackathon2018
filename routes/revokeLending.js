var express = require('express');
var router = express.Router();

var smartcar = require("../lib/smartcar");
const models = require('../models/user.model');

router.post('/', function (req, res, next) {
    let reqAction = req.body.action;
    let reqCarName = req.body.car;
    let owner = req.cookies.user;

    if (reqAction === "revoke") {
        models.UserModel.findOne({'name': owner}, function (err, userFromDb) {
            if (err || !userFromDb) {
                res.redirect('/');
            } else {
                let car;
                for (var i = 0; i < userFromDb.cars.length; i++) {
                    if (userFromDb.cars[i].name === reqCarName) {
                        car = userFromDb.cars[i];
                    }
                }
                if (car) {
                    car.lender = null;
                    userFromDb.save(
                        function (err) {
                            if (err) {
                                res.redirect('lending?car=' + car.name);
                            } else {
                                res.redirect('lending?car=' + car.name);
                            }
                        });
                } else {
                    res.redirect('/carList');
                }
            }
        });
    } else if (reqAction === "lock" || reqAction === "unlock") {
        models.get_car_from_user('owner', reqCarName, function(car) {
            var data = {car: car};

                var lock_vehicle = function(vehicle) {
                    console.log("###vehicle: " + JSON.stringify(vehicle));
                    smartcar.lock_vehicle(vehicle, function(lock_res) {
                        console.log("###lock_res: " + JSON.stringify(lock_res));
                        if (!lock_res) {
                            data["status_msg"] = "Lock request sent";
                        } else {
                            data["status_msg"] = "Lock request failed";
                        }
                        res.redirect('lending?car=' + reqCarName);
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
                        res.redirect('lending?car=' + reqCarName);
                    });
                };

                smartcar.get_credentials('owner', function(credentials) {
                    if (!credentials) {
                        const message = "Not authorized";
                        const action = "";
                        return redirectToError(res, message, action);
                    } else {
                        var vehicle = smartcar.get_vehicle(credentials.accessToken, car.smartcar_id);
                        if (reqAction === "lock") {
                            lock_vehicle(vehicle);
                        } else if (reqAction === "unlock") {
                            unlock_vehicle(vehicle);
                        }
                    }
                });
        });
    }

});


module.exports = router;