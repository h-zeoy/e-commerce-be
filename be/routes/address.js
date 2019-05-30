const express = require('express')

const router = express.Router()

const addressController = require('../controllers/address.controller')

const authMiddleware = require('../middlewares/auth.js')

router.use(function(req, res, next) {
    //console.log(req);
    console.log(req.method);
    res.header("Access-Control-Allow-Origin", "*");
    // res.addHeader('Access-Control-Allow-Headers','X-Root-Auth-Token');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization,X-Root-Auth-Token");
    res.header("cache-control", "no-cache");
    res.header("content-type", "application/json; charset=utf-8");
    res.header("ETag", '');
    //header头信息设置结束后，结束程序往下执行，返回
    if(req.method.toLocaleLowerCase() === 'options'){
        res.status(204);
        return res.json({});   //直接返回空数据，结束此次请求
    }else{
        next();
    }
});

router.get('/list', authMiddleware.auth, addressController.list)

router.post('/add', authMiddleware.auth, addressController.add)

router.post('/update', authMiddleware.auth, addressController.update)

router.get('/remove', authMiddleware.auth, addressController.remove)

module.exports = router