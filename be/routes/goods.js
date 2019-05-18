const express = require('express')

const router = express.Router()

const goodsController = require('../controllers/goods.controller')


router.get('/list', goodsController.list)

router.post('/save', goodsController.save)

router.post('/update', goodsController.update)

router.get('/listone', goodsController.listone)

router.get('/listall', goodsController.listall)

router.get('/lowershelf', goodsController.lowershelf)

router.get('/uppershelf', goodsController.uppershelf)

module.exports = router