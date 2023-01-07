var express = require('express');
const { getCars, getCar, insertCar, deleteCar, updateCar } = require('../../db');
const { sendErrorResponse, sendResponse } = require('./util/responseBuilder');
var {
	ReasonPhrases,
	StatusCodes
} = require('http-status-codes');
const authChecker = require('./util/authChecker');
var router = express.Router();

router.get('/', async function(req, res) {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Cars fetched successfully',
    response: await getCars(),
  });
});

router.post('/', authChecker, async function(req, res) {
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

router.get('/:id', async function(req, res) {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Car fetched successfully',
    response: await getCar(req.params.id),
  });
});

router.put('/:id', authChecker, async function(req, res) {
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Car updated successfully',
    response: await updateCar(req.params.id, req.body),
  });
});

router.delete('/:id', authChecker, async function(req, res) {
  await deleteCar(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'Car deleted successfully',
    response: null,
  });
});

router.all('*', function(req, res) {
  sendErrorResponse(res, {
    statusCode: StatusCodes.METHOD_NOT_ALLOWED,
    responseStatus: ReasonPhrases.METHOD_NOT_ALLOWED,
    message: `Car with id ${req.params.id} not found`,
  });
});

module.exports = router;
