var passport = require('passport');
var express = require('express');
const { sendResponse, sendErrorResponse } = require('./util/responseBuilder');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { deleteUser } = require('../../db');
var router = express.Router();

router.get('/login', passport.authenticate('twitter', {
  scope: ['tweet.read', 'users.read'],
  failureRedirect: 'api/v1/login/failure',
}));


router.get('/login/callback',
  passport.authenticate('twitter', {
    scope: ['tweet.read', 'users.read'],
  }),
  async function(req, res) {
    res.redirect(`${req.baseUrl}/login/success`);
  }
);

router.get('/login/success', function(req, res) {
  const user = req.user;
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    responseStatus: ReasonPhrases.OK,
    message: 'User login successfully',
    response: {
      user: user,
    },
  });
});

router.get('/login/failure', function(req, res) {
  sendErrorResponse(res, {
    statusCode: StatusCodes.BAD_REQUEST,
    responseStatus: ReasonPhrases.BAD_REQUEST,
    message: 'User login failed'
  });
});

router.post('/logout', async function(req, res, next){
  await deleteUser({ ...req.user });
  req.logout(function(err) {
    if (err) { return next(err); }
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      responseStatus: ReasonPhrases.OK,
      message: 'Logout successful',
      response: null,
    });
  });
});

module.exports = router;