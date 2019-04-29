var express = require('express');
var router = express.Router();

const listController = require('../controllers/list');
/* GET users listing. */
router.get('/all', listController.listAll);

module.exports = router;