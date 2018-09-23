var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var carListRouter = require('./routes/carList');
var smartcarRouter = require('./routes/smartcar');
var loginRouter = require('./routes/login');
var lendingRouter = require('./routes/lending');
var lendRouter = require('./routes/lend');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/carList', carListRouter);
app.use('/smartcar', smartcarRouter);
app.use('/lending', lendingRouter);
app.use('/lend', lendRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/keybuttler');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("MongoDb connected")
});

const User = require('./models/user.model');
User.deleteMany({}, function (err) {
    if (err) return console.error(err);
});
var owner = new User({ name: 'owner', password: 'password', cars: [{name: "VW"}, {name: "Ford"}, {name: "Tesla"}] });
owner.save(function (err, owner) {
    if (err) return console.error(err);
});
var lender = new User({ name: 'lender', password: 'password' });
lender.save(function (err, lender) {
    if (err) return console.error(err);
});

module.exports = app;
