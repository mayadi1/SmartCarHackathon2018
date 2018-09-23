var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/', function(req, res, next) {
    const models = require('../models/user.model');
    let action = req.body.type;
    if (action === "owner") {
        res.redirect('/smartcar/auth');
    } else {
        res.redirect('/login');
    }

});

module.exports = router;
