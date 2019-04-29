const listModel = require('../models/list');
//显示全部商品
const listAll = async (req, res, next) =>{
    res.header('Content-Type', 'application/json; charset=utf-8')
    try {
        let result = await listModel.listAll("select * from list");
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
//创建商品

module.exports = {
    listAll
}