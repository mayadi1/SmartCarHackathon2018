var express = require('express');
var router = express.Router();


const User = require('../models/user.model');

router.post('/', function(req, res, next) {

    if ((req.body.u === "owner" || req.body.u === "lender") && req.body.p === "password") {
        res.cookie('user', req.body.u);
        res.redirect('/carlist');
    }
    else {
        res.render('index', { result: 'Login failed' });
    }
});

module.exports = router;
