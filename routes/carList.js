var express = require('express');
var router = express.Router();
var smartcar = require("../lib/smartcar");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('carList', { title: 'KeyButtler' });
});

module.exports = router;
