var express = require('express');
var router = express.Router();
var smartcar = require("../lib/smartcar");

/* GET home page. */
router.get('/', function(req, res, next) {
    var credentials = smartcar.get_credentials();
    console.log("credentials: " + credentials);    
    console.log("credentials['accessToken']: " + credentials['accessToken']);
    smartcar.get_vehicles(credentials.accessToken, function(res) {
        console.log(JSON.stringify(res));
        res.render('carList', res);
    });
});

module.exports = router;
