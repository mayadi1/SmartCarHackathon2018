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
var revokeLendingRouter = require('./routes/revokeLending');
var lockRouter = require('./routes/lock');
var registerRouter = require('./routes/register');
var lendingsRouter = require('./routes/lendings');

const models = require('./models/user.model');

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
app.use('/lock', lockRouter);
app.use('/lend', lendRouter);
app.use('/revokeLending', revokeLendingRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/lendings', lendingsRouter);

app.get('/error', function(req, res, next) {
    const {action, message} = req.query;
    if (!action && !message) {
      return res.redirect('/');
    }

    res.render('error', {action, message});

  });

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

// upsert lender
var initial_dict = {
    name: 'lender',
    password: 'password' };
models.upsert_user(initial_dict, function(err, lender){
    if (err) {
        return console.error(err);
    }
});

module.exports = app;
