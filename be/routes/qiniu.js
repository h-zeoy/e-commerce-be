var express = require('express');
var router = express.Router();
const qiniuController = require('../controllers/qiniu.controller');
router.post('/cloneupload', qiniuController.cloneupload)
router.post('/moreupload', qiniuController.moreupload)
module.exports = router;
