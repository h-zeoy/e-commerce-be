const express = require('express')

const router = express.Router()

const authMiddleware = require('../middlewares/auth.js')

const orderController = require('../controllers/order.controller')


router.get('/list',  authMiddleware.auth, orderController.list)

router.get('/detail',  authMiddleware.auth, orderController.detail)

router.post('/create',  authMiddleware.auth, orderController.create)



module.exports = router