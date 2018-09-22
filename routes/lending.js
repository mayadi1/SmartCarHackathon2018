var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('Lending', { title: 'KeyButtler' });
});


module.exports = router;