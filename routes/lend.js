var express = require('express');
var router = express.Router();

const User = require('../models/user.model');

router.post('/', function (req, res, next) {
    let reqLender = req.body.lender;
    let reqCarName = req.body.car;
    // type checking userId
    User.findOne({'name': reqLender}, function (err, userFromDb) {
            if (err || !userFromDb) {
                res.render('lendingPrepare', {error: "Please enter a valid userId", car: {name: reqCarName}});
            } else {
                let owner = req.cookies.user
                User.findOne({'name': owner}, function (err, userFromDb) {
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
                            car.lender = reqLender;
                            userFromDb.save(
                                function (err) {
                                if (err) {
                                    res.redirect('lending?car' + car.name);
                                } else {
                                    res.redirect('lending?car=' + car.name);
                                }
                            });
                        } else {
                            res.redirect('/carList');
                        }
                    }
                });
            }
        }
    );
});


module.exports = router;