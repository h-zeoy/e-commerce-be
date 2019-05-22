var express = require('express');
var router = express.Router();

const userController = require('../controllers/user.controller')

const codeController = require('../controllers/code.controller')
// 注册
router.post('/signup', userController.signup)

// 登录
router.post('/signin', userController.signin)

// 发送短信
router.post('/sendcode', codeController.send)

// 验证短信
router.post('/getDetail', codeController.getDetail)

//获取最大uid
router.get('/maxId', userController.getUid)

//获取最大uid
router.post('/addPass', userController.addPass)

//获取最大uid
router.post('/isPass', userController.isPass)

// 查询短信
router.post('/seccode', codeController.getDetail)
module.exports = router;
