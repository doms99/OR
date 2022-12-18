var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { connectToDb } = require("./db/db");

var indexRouter = require('./routes/index');
var datatableRouter = require('./routes/datatable');
var apiRouter = require('./routes/api/api');
const { sendErrorResponse } = require('./routes/api/util/responseBuilder');
var {
	ReasonPhrases,
	StatusCodes
} = require('http-status-codes');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'datatable')));

app.use('/', indexRouter);
app.use('/datatable', datatableRouter);
app.use('/api/v1', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  sendErrorResponse(res, {
    statusCode: StatusCodes.NOT_FOUND,
    responseStatus: ReasonPhrases.NOT_FOUND,
    message: `Not found ${req.url}`
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  sendErrorResponse(res, {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    responseStatus: ReasonPhrases.INTERNAL_SERVER_ERROR,
    message: `Internal server error`
  })
});

(async function() {
  await connectToDb();
})();

module.exports = app;
