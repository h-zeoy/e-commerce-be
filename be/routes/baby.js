const express = require('express')

const router = express.Router()

const babyController = require('../controllers/baby.controller')


router.get('/list', babyController.list)

router.post('/save', babyController.save)

router.post('/update', babyController.update)

router.get('/listone', babyController.listone)

router.get('/listall', babyController.listall)

router.get('/lowershelf', babyController.lowershelf)

router.get('/uppershelf', babyController.uppershelf)

router.get('/todaysale', babyController.todaysale)


module.exports = router