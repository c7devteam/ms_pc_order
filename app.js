var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')

var routes = require('./routes/index');
var orders_v1 = require('./routes/v1/orders');

var db_config = require('./config/database.json');


var app = express();

var NODE_ENV = (process.env.NODE_ENV || 'development');

// setting up database
var mysql = require('mysql'); // node-mysql module

var myConnection = require('express-myconnection'); // express-myconnection module
    var dbOptions = {
      host: db_config[NODE_ENV].host,
      user: db_config[NODE_ENV].user,
      password: db_config[NODE_ENV].password,
      port: db_config[NODE_ENV].port,
      database: db_config[NODE_ENV].database
    };

app.use(myConnection(mysql, dbOptions, 'single'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator({}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/v1/orders',orders_v1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
