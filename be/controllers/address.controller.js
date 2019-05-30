
const addressModel = require('../models/address.model');
const usersModel = require('../models/user.model');

const getaddressId = async (req, res, next) => {
    let _ = (await addressModel.addressMaxId())[0]
    let id = _['max(id)'] && _['max(id)'] >= 1 ? Number(_['max(id)']) + 1 : 1;
    console.log(_['max(id)'])
    return id;
}

const list = async(username, req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let uid = (await usersModel.secUid('username', username))[0];
    let addressId = (await addressModel.selectId(uid.id))[0].addressId;
    let _  = (await addressModel.selectInfo(addressId));
    if (_.flag) {
        _.result
          ? res.render('user.view.ejs', {
                success: JSON.stringify(true),
                data: JSON.stringify(JSON.parse(_.result.addressInfo)),
                code: JSON.stringify(0),
            })
          : res.render('user.view.ejs', {
                success: JSON.stringify(true),
                data: JSON.stringify([]),
                code: JSON.stringify(0),
            });
    }
} 

const add = async(username,req, res, next) => {
    /*
        添加地址：users表查看是否有addressId,
        如果有 获取info 在info后续添加
        如果没有 获取地址表的最大ID，
        在users表插入addressID，在addres表插入信息
    */
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Headers','x-access-token');
    let addressId = '';
    let params = {};
    let addressInfo = req.body;
    let uid = (await usersModel.secUid('username', username))[0];
    addressId = (await addressModel.selectId(uid.id))[0].addressId;params['uid'] = uid.id;
    // 从未添加过地址 
    if (!addressId) {
        let infoArr = [];
        params['way'] = 1;
        params['addressId'] = await getaddressId();
        addressInfo['id'] = infoArr.length + 1;
        infoArr.push(addressInfo);
        params['addressInfo'] = JSON.stringify(infoArr);
    } else {
        let _  = (await addressModel.selectInfo(addressId));
        params['way'] = 2;
        if (_.flag) {
            params['addressId'] = addressId;
            let resInfo = JSON.parse(_.result.addressInfo);
            addressInfo['id'] = resInfo[0].id + 1;
            if (addressInfo.isDefault) {
                resInfo = resInfo.map(it => {
                    it.isDefault = false;
                    return it;
                })
            }
            resInfo.unshift(addressInfo);
            params['addressInfo'] = JSON.stringify(resInfo);
        } else {
            res.render('user.view.ejs', {
                success: JSON.stringify(false),
                data: JSON.stringify({
                    msg: '地址添加失败'
                }),
                code: JSON.stringify(1),
            })
            return;
        }
        
    }
    let result = await addressModel.add(params);
    console.log(result);
    if (result.flag) {
        res.render('user.view.ejs', {
            success: JSON.stringify(true),
            data: JSON.stringify({
                msg: '地址添加成功'
            }),
            code: JSON.stringify(0),
        })
    } else {
        res.render('user.view.ejs', {
            success: JSON.stringify(false),
            data: JSON.stringify({
                msg: '地址添加失败'
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
    let uid = (await usersModel.secUid('username', username))[0];
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

const remove = async(username, req, res, next) => {
    // 删除 查看info长度 如果 === 1 删除address 并且 users ID= 0
    // ！== 1 update info
    let { id } = req.query;
    let flag = true;
    let index = 0;
    let uid = (await usersModel.secUid('username', username))[0];
    let addressId = (await addressModel.selectId(uid.id))[0].addressId;
    let _  = (await addressModel.selectInfo(addressId));
    if (_.flag) {
        let addressInfo = JSON.parse(_.result.addressInfo);
        if (addressInfo.length > 1) {
            addressInfo.map((it,i) => {
                if (it.id == id) {
                    index = i;
                }
            })
            addressInfo.splice(index, 1);
            console.log(addressInfo);
            let result = await addressModel.update(addressId, JSON.stringify(addressInfo));
            // flag = result.flag;
            console.log(result);
        } else {
            let result = await addressModel.remove(uid.id, addressId);
            flag = result.flag;
        }
        
    } else {
        flag = _.flag
    }
    flag
      ? res.render('user.view.ejs', {
            success: JSON.stringify(true),
            data: JSON.stringify({
                msg: '地址删除成功'
            }),
            code: JSON.stringify(0),
        })
      : res.render('user.view.ejs', {
            success: JSON.stringify(false),
            data: JSON.stringify({
                msg: '地址删除失败'
            }),
            code: JSON.stringify(1),
        });

}
module.exports = {
    list,
    add,
    update,
    remove
}