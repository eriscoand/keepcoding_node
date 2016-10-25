'use strict';

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('./lib/mongoConnection');
require('./models/usuario'); 
require('./models/anuncio'); 

var users = require('./routes/users');
var anuncios = require('./routes/anuncios');

var app = express();

var config = require('./config.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(config.api_url+'/users', users);
app.use(config.api_url+'/anuncios', anuncios);

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
    if(req.url.includes(config.api_url)){
      //RESPUESTA ERROR JSON
      res.json({
        message: err.error,
        detail: err.detail
      });
    }else{      
      //RESPUESTA ERROR HTML
      res.render('error', {
        message: err.error,
        error: err.detail
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if(req.url.includes(config.api_url)){
    //RESPUESTA ERROR JSON
    res.json({
        message: err.error,
        detail: err.detail
    });
  }else{      
    //RESPUESTA ERROR HTML
    res.render('error', {
        message: err.error,
        error: err.detail
    });
  }
});


module.exports = app;
