var express = require('express');
var router = express.Router();

const models = require('../models/user.model');
const smartcar = require("../lib/smartcar");
const google_maps = require("../lib/google_maps");

const GOOGLE_API_KEY = "AIzaSyDvWHFx3eLPTVVvsfEn-iFxt46jwKFiJYM";

router.get('/', function(req, res, next) {
    console.log("###cookie user name: " + req.cookies.user);
    models.get_car_from_user(req.cookies.user, req.query.car, function(car) {
        if (car) {
            if (car.lender) {
                res.render('lendingDone', { car: car});
            } else {
                console.log("###lending");
                models.get_user_by_name(req.cookies.user, function(err, docs) {
                    var userFromDb = docs[0];
                    var vehicle = smartcar.get_vehicle(userFromDb.credentials.accessToken, car.smartcar_id);
                    smartcar.get_vehicle_location(vehicle, function(loc_res) {
                        console.log("###loc_res: " + JSON.stringify(loc_res));
                        var data = {
                            car: car,
                            google_api_key: GOOGLE_API_KEY,
                            lat: loc_res.data.latitude,
                            lng: loc_res.data.longitude
                        };

                        google_maps.get_street_address(GOOGLE_API_KEY, data.lat, data.lng, function(street_address) {
                            data['street_address'] = street_address;

                            res.render('lendingPrepare', data);
                        });
                    });
                });
            }
        } else{
            res.redirect('/carList');
        }
    });
});


module.exports = router;