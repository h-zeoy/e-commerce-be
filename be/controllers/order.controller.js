

const orderModel = require('../models/order.model');
const usersModel = require('../models/user.model');
const getOrderId = async (req, res, next) => {
    let _ = (await orderModel.orderMaxId())[0]
    let id = _['max(id)'] && _['max(id)'] >= 1 ? Number(_['max(id)']) + 1 : 1;
    console.log(_['max(id)'])
    return id;
}
function getOrderNO() {
    let id = "";
    for (var i = 0; i < 5; i++) //j位随机数，用以加在时间戳后面。
    {
        id += Math.floor(Math.random() * 10);
    }
    id = new Date().getTime() + id;
    return id;
}
const list = async (username, req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.header('Content-Type', 'application/json; charset=utf8');
    let { status } = req.query;
    let name = "";
    switch(status) {
        case '1': name = "待付款";break;
        case '2': name = "待发货";break;
        case '3': name = "待收货";break;
        case '0': name = "全部";break;
    }
    let uid = {}
    if(/^[0-9]+$/.test(username)) {
        uid = (await usersModel.secUid('tel', username))[0];
    } else {
        uid = (await usersModel.secUid('username', username))[0];
    }
    id = (await orderModel.selectId(uid.id))[0].orderId;
    let _  = (await orderModel.selectInfo(id));
    if (_.flag) {
        let arrPush = [];
        let newArr = JSON.parse(_.result.orderInfo);
        if (name === '待发货') {
            for (let i = 0;i<newArr.length;i++) {
                if (newArr[i].status === "待发货") {
                   arrPush.push(newArr[i])
                }
            }
        } else if (name === '待付款') {
            for (let i = 0;i<newArr.length;i++) {
                if (newArr[i].status === "待付款") {
                   arrPush.push(newArr[i])
                }
            }
        } else if (name === '待收货') {
            for (let i = 0;i<newArr.length;i++) {
                if (newArr[i].status === "待收货") {
                   arrPush.push(newArr[i])
                }
            }
        } else {
            arrPush = newArr;
        }
        res.render('user.view.ejs', {
            success: JSON.stringify(true),
            data: JSON.stringify(arrPush),
            code: JSON.stringify(0),
        })
    } else  {
        res.render('user.view.ejs', {
            success: JSON.stringify(false),
            data: JSON.stringify({
                msg: '订单错误',
            }),
            code: JSON.stringify(1),
        })
    }
}

const detail = async (username, req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.header('Content-Type', 'application/json; charset=utf8');
    let { orderId } = req.query;
    console.log('orderId', orderId)
    let uid = {}
    if(/^[0-9]+$/.test(username)) {
        uid = (await usersModel.secUid('tel', username))[0];
    } else {
        uid = (await usersModel.secUid('username', username))[0];
    }
    id = (await orderModel.selectId(uid.id))[0].orderId;
    let _  = (await orderModel.selectInfo(id));
    if (_.flag) {
        let newArr = JSON.parse(_.result.orderInfo);
        let data = {};
        for (let i = 0;i<newArr.length;i++) {
            if (newArr[i].id == orderId) {
                data = newArr[i];
            }
        }
        
        res.render('user.view.ejs', {
            success: JSON.stringify(true),
            data: JSON.stringify(data),
            code: JSON.stringify(0),
        })
    } else  {
        res.render('user.view.ejs', {
            success: JSON.stringify(false),
            data: JSON.stringify({
                msg: '订单错误',
            }),
            code: JSON.stringify(1),
        })
    }
    

}

const create = async (username, req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.header('Content-Type', 'application/json; charset=utf8');
    let orderId = '';
    let params = {};
    let orderInfo = req.body;
    let uid = {}
    if(/^[0-9]+$/.test(username)) {
        uid = (await usersModel.secUid('tel', username))[0];
    } else {
        uid = (await usersModel.secUid('username', username))[0];
    }
    orderId = (await orderModel.selectId(uid.id))[0].orderId;
    params['uid'] = uid.id;
    let id = '';
    // 从未购买过
    if (!orderId || orderId == 0) {
        params['way'] = 1;
        let infoArr = [];
        params['orderId'] = await getOrderId();
        id = infoArr.length + 1000;
        orderInfo['id'] = id;
        orderInfo['orderNo'] = getOrderNO();
        infoArr.push(orderInfo);
        params['orderInfo'] = JSON.stringify(infoArr);
    } else {
        let _  = (await orderModel.selectInfo(orderId));
        params['way'] = 2;
        if (_.flag) {
            params['orderId'] = orderId;
            let resInfo = JSON.parse(_.result.orderInfo);
            id = resInfo[0].id + 1;
            orderInfo['id'] = id;
            orderInfo['orderNo'] = getOrderNO();
            if (orderInfo.isDefault) {
                resInfo = resInfo.map(it => {
                    it.isDefault = false;
                    return it;
                })
            }
            resInfo.unshift(orderInfo);
            params['orderInfo'] = JSON.stringify(resInfo);
        } else {
            res.render('user.view.ejs', {
                success: JSON.stringify(false),
                data: JSON.stringify({
                    msg: '创建订单失败'
                }),
                code: JSON.stringify(1),
            })
            return;
        }
    }
    let result = await orderModel.create(params);
    console.log(result);
    if (result.flag) {
        res.render('user.view.ejs', {
            success: JSON.stringify(true),
            data: JSON.stringify({
                msg: '订单创建成功',
                orderId: id,
            }),
            code: JSON.stringify(0),
        })
    } else {
        res.render('user.view.ejs', {
            success: JSON.stringify(false),
            data: JSON.stringify({
                msg: '订单创建失败'
            }),
            code: JSON.stringify(1),
        })
    }
}

const update = async(username, req, res, next) => {
    // 修改流程 uid 获取地址id
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader('Access-Control-Allow-Headers','x-access-token');
        let addressInfo = req.body;
        let flag =false;
        let uid = {}
        if(/^[0-9]+$/.test(username)) {
            uid = (await usersModel.secUid('tel', username))[0];
        } else {
            uid = (await usersModel.secUid('username', username))[0];
        }
        let addressId = (await addressModel.selectId(uid.id))[0].addressId;
        let _ = (await addressModel.selectInfo(addressId));
        let newArr = JSON.parse(_.result.addressInfo);
        if (_.flag) {
            flag = true;
            if (addressInfo.isDefault) {
                for (let i = 0;i<newArr.length;i++) {
                    newArr[i].isDefault = false;
                }
                for (let i = 0;i<newArr.length;i++) {
                    if (newArr[i].id === addressInfo.id) {
                        newArr[i] = addressInfo;
                    }
                }
                let result = await addressModel.update(addressId, JSON.stringify(newArr));
                flag = result.flag;
                
            }
        }
        flag
          ? res.render('user.view.ejs', {
              success: JSON.stringify(true),
              data: JSON.stringify({msg: '地址修改成功'}),
              code: JSON.stringify(0),
          })
          : res.render('user.view.ejs', {
              success: JSON.stringify(false),
              data: JSON.stringify({msg: '地址修改失败'}),
              code: JSON.stringify(1),
          })
        
        
    }

module.exports = {
    list,
    detail,
    create,
}