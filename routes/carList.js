var express = require('express');
var router = express.Router();
var smartcar = require("../lib/smartcar");

/* GET home page. */
router.get('/', function(req, res, next) {
    var router_res = res;
    var callback = function(credentials) {
        console.log("credentials: " + credentials);    
        console.log("credentials['accessToken']: " + credentials['accessToken']);
        smartcar.get_vehicles(credentials.accessToken, function(vehicles) {
            console.log(vehicles);

            router_res.render('carList', {});
        });
    };

    smartcar.get_credentials(callback);
});

module.exports = router;
