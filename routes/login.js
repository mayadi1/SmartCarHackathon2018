var express = require('express');
var router = express.Router();


const models = require('../models/user.model');

router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function(req, res, next) {
    models.UserModel.findOne({ 'name': req.body.u }, function (err, userFromDb) {
        if (err || !userFromDb) {
            res.render('index', { result: 'Login failed' });
        } else {
            if (userFromDb.password === req.body.p) {
                res.cookie('user', req.body.u);
                res.redirect('/carList');
            }
            else {
                res.render('index', { result: 'Login failed' });
            }
        }
    });
});

module.exports = router;
