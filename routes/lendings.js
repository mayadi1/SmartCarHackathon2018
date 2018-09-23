var express = require('express');
var router = express.Router();
const models = require('../models/user.model');

/* GET home page. */
router.get('/', function(req, res, next) {
    models.get_user_by_name(req.cookies.user, function(err, user) {
        if (err) {
            console.error(err);
        } else {
            res.render("lendings", user.lendings)
        }
    });
});

module.exports = router;
