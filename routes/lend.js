var express = require('express');
var router = express.Router();

const models = require('../models/user.model');

const GOOGLE_API_KEY = "AIzaSyDvWHFx3eLPTVVvsfEn-iFxt46jwKFiJYM";

router.post('/', function (req, res, next) {
    User.findOne({'name': req.cookies.user}, function (err, userFromDb) {
        if (err || !userFromDb) {
            res.redirect('/');
        } else {
            let car;
            for (var i = 0; i < userFromDb.cars.length; i++) {
                if (userFromDb.cars[i].name === req.query.car) {
                    car = userFromDb.cars[i];
                }
            }
            if (car) {
                car.lender = req.body.userId
                models.User.findOneAndUpdate(
                    {'name': req.cookies.user}),
                    {
                        "$set": {
                            "cars.$": car
                        }
                    }, function (err, doc) {
                    if (err) {
                        res.render('lendingPrepare', {error: "Could not get the car"});
                    } else {
                        console.log("###lend");
                        var data = {
                            car: car,
                            google_api_key: GOOGLE_API_KEY
                        };
                        res.render('lendingDone', data);
                    }
                }

            } else {
                res.redirect('/carList');
            }
        }
    });
});


module.exports = router;