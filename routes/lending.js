var express = require('express');
var router = express.Router();

const User = require('../models/user.model');

router.get('/', function(req, res, next) {
    User.findOne({ 'name': req.cookies.user }, function (err, userFromDb) {
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
                if (car.lender) {
                    res.render('lendingDone', { car: car});
                } else {
                    res.render('lendingPrepare', { car: car});
                }
            } else{
                res.redirect('/carList');
            }
        }
    });
});


module.exports = router;