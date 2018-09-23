var express = require('express');
var router = express.Router();


const User = require('../models/user.model');

router.post('/', function(req, res, next) {

    User.findOne({ 'name': req.body.u }, function (err, userFromDb) {
        if (err || !userFromDb) {
            res.render('index', { result: 'Login failed' });
        } else {
            if (userFromDb.password === req.body.p) {
                res.cookie('user', req.body.u);
                res.redirect('/carlist');
            }
            else {
                res.render('index', { result: 'Login failed' });
            }
        }
    });


});

module.exports = router;
