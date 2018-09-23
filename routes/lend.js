var express = require('express');
var router = express.Router();

const models = require('../models/user.model');

router.post('/', function (req, res, next) {
    let reqLender = req.body.lender;
    let reqCarName = req.body.car;
    // type checking userId
    models.UserModel.findOne({'name': reqLender}, function (err, lenderFromDb) {
            if (err || !lenderFromDb) {
                res.render('lendingPrepare', {error: "Please enter a valid userId", car: {name: reqCarName}});
            } else {
                let owner = req.cookies.user
                // update owner
                models.UserModel.findOne({'name': owner}, function (err, ownerFromDb) {
                    if (err || !ownerFromDb) {
                        res.redirect('/');
                    } else {
                        let car;
                        for (var i = 0; i < ownerFromDb.cars.length; i++) {
                            if (ownerFromDb.cars[i].name === reqCarName) {
                                car = ownerFromDb.cars[i];
                            }
                        }
                        if (car) {
                            car.lender = reqLender;
                            ownerFromDb.save(
                                function (err) {
                                    if (err) {
                                       console.log("Error saving owner", err)
                                    } else  {
                                        // update lender
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