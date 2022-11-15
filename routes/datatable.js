var express = require('express');
var router = express.Router();
var { getObject } = require('../db');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('datatable.html');
});

router.get('/data', async function(req, res, next) {
  const object = await getObject(req.query);

  console.log(req.query);

  res.json(object);
});

module.exports = router;
