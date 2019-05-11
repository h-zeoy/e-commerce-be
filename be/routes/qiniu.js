const express = require('express')
const router = express.Router()

const qiniuController = require('../controllers/qiniu.controller')

router.post("/upload", qiniuController.upload)


module.exports = router

