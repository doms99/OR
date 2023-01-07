var express = require('express');
var router = express.Router();
var {
	ReasonPhrases,
	StatusCodes
} = require('http-status-codes');
const { sendErrorResponse } = require('./util/responseBuilder');

var carsRouter = require('./cars');
var enginesRouter = require('./engines');
var authRouter = require('./auth');
const { getUser } = require('../../db');

router.use('*', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(authHeader === undefined) {
    next();
    return;
  }

  const authSplit = authHeader.trim().split(/\s+/);
  if(authSplit.length != 2 || authSplit[0] != 'Bearer') {
    next();
    return;
  }

  req.myUser = await getUser(authSplit[1]);
  next();
});

router.use('/', authRouter);

router.use('/', function(req, res, next) {
  if(req.headers['accept'] && req.headers['accept'] != 'application/json') {
    sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_ACCEPTABLE,
      responseStatus: ReasonPhrases.NOT_ACCEPTABLE,
      message: `Not supported content type ${req.headers['content-type']}`,
    });
    return;
  }
  if((req.method == "PUT" || req.method == "POST") && req.headers['content-type'] && req.headers['content-type'] != 'application/json') {
    sendErrorResponse(res, {
      statusCode: StatusCodes.UNSUPPORTED_MEDIA_TYPE,
      responseStatus: ReasonPhrases.UNSUPPORTED_MEDIA_TYPE,
      message: `Not supported accept type ${req.headers['accept']}`,
    });
    return;
  }

  next();
});

router.use('/cars', carsRouter);
router.use('/engines', enginesRouter);

module.exports = router;
