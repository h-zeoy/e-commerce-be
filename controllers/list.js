const listModel = require('../models/list');
//显示全部商品
const listAll = async (req, res, next) =>{
    res.header('Content-Type', 'application/json; charset=utf-8');
    try {
        let result = await listModel.listAll("select * from list");
        console.log(result);
        res.render('list', {
            success: true,
            data: JSON.stringify({
                msg: '数据查询成功 :)',
                data: result
            })
        });
    } catch(err) {
        res.render('list', {
            success: false,
            data: JSON.stringify({
                msg: '数据查询失败 :('
            })
        });
    }
}

//添加商品
const addGoods = async(req, res, next) => {
    let goodsId = 2;
    let name = '孕妇装';
    let price = 89.9;
    let linePrice = 109.9;
    let channel = 1;
    let stock = 10;
    let code = '00000002';
    let sql = `
    insert into list(goodsId, name, price, linePrice, channel, stock, code) 
    value (${goodsId}, "${name}", ${price}, ${linePrice}, ${channel}, ${stock}, "${code}")
    `;
    res.header('Content-Type', 'application/json; charset=utf-8');
    try {
        await listModel.addGoods(sql);
        res.render('list', {
            success: true,
            data: JSON.stringify({
                msg: '数据添加成功 :)'
            })
        });
    } catch (err) {
        console.log(err);
        res.render('list', {
            success: false,
            data: JSON.stringify({
                msg: '数据添加失败 :('
            })
        });
    }
}

module.exports = {
    listAll,
    addGoods
}