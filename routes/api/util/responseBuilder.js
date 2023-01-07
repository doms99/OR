function sendErrorResponse(res, obj) {
  return res.status(obj.statusCode).json({
    status: obj.responseStatus,
    message: obj.message,
    response: obj.response ?? null,
  });
}

function sendResponse(res, obj) {
  return res.status(obj.statusCode).json({
    status: obj.responseStatus,
    message: obj.message,
    response: obj.response,
  });
}

module.exports = { sendResponse, sendErrorResponse }
