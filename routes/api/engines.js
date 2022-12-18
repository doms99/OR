var express = require('express');
const { getEngines, getEngine, getCarsForEngine } = require('../../db');
const { sendErrorResponse, sendResponse } = require('./util/responseBuilder');
var {
	ReasonPhrases,
	StatusCodes
} = require('http-status-codes');
var router = express.Router();

router.get('/', async function(req, res, next) {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Cars fetched successfully',
    response: await getEngines(),
  });
});

router.use('/:id', async function(req, res, next) {
  if(!await getEngine(req.params.id) || await getEngine(req.params.id) == null) {
    sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      responseStatus: ReasonPhrases.NOT_FOUND,
      message: `Engine with id ${req.params.id} not found`,
    });
    return;
  }
  next();
});

router.get('/:id', async function(req, res, next) {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Car fetched successfully',
    response: await getEngine(req.params.id),
  });
});

router.get('/:id/cars', async function(req, res, next) {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Car fetched successfully',
    response: await getCarsForEngine(req.params.id),
  });
});

module.exports = router;
