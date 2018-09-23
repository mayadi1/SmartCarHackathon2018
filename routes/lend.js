var express = require('express');
var router = express.Router();

const User = require('../models/user.model');

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
                User.findOneAndUpdate(
                    {'name': req.cookies.user}),
                    {
                        "$set": {
                            "cars.$": car
                        }
                    }, function (err, doc) {
                    if (err) {
                        res.render('lendingPrepare', {error: "Could not get the car"});
                    } else {
                        res.render('lendingDone', {car: car});
                    }
                }

            } else {
                res.redirect('/carList');
            }
        }
    });
});


module.exports = router;