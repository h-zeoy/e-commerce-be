const express = require('express')

const router = express.Router()

const addressController = require('../controllers/address.controller')

router.get('/list', addressController.list)

router.post('/add', addressController.add)

router.post('/update', addressController.update)

router.post('/remove', addressController.remove)

module.exports = router