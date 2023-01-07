const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { sendErrorResponse } = require("./responseBuilder");

function authChecker(req, res, next) {
  if (req.myUser !== undefined && req.myUser !== null) {
    next();
  } else {
    sendErrorResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      responseStatus: ReasonPhrases.UNAUTHORIZED,
      message: `You are not logged in`,
      response: {
        'login_url': 'http://localhost:3000/api/v1/login'
      }
    });
  }
}

module.exports = authChecker;