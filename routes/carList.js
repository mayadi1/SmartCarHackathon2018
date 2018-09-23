var express = require('express');
var router = express.Router();

const models = require('../models/user.model');

/* GET home page. */
router.get('/', function(req, res, next) {
    models.get_user_by_name(req.cookies.user, function (err, userFromDb) {
        let user = userFromDb[0];
        res.render('carList', { "vehicles": user.cars});
    });
    console.log("###smartcar.get_credentials");
});

module.exports = router;
