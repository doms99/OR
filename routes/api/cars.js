var express = require('express');
const { getCars, getCar, insertCar, deleteCar } = require('../../db');
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
    response: await getCars(),
  });
});

router.post('/', async function(req, res, next) {
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    responseStatus: ReasonPhrases.CREATED,
    message: 'Cars created successfully',
    response: await insertCar(req.body),
  });
});

router.use('/:id', async function(req, res, next) {
  if(!await getCar(req.params.id) || await getCar(req.params.id) == null) {
    sendErrorResponse(res, {
      statusCode: StatusCodes.NOT_FOUND,
      responseStatus: ReasonPhrases.NOT_FOUND,
      message: `Car with id ${req.params.id} not found`,
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
    response: await getCar(req.params.id),
  });
});

router.put('/:id', async function(req, res, next) {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Car updated successfully',
    response: await insertCar(req.params.id, req.body),
  });
});

router.delete('/:id', async function(req, res, next) {
  await deleteCar(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Car deleted successfully',
    response: null,
  });
});

module.exports = router;
