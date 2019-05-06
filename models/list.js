const pool = require('../utils/database');

//显示 所有的数据
const listAll = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            err ? reject(err) : connection.query(sql, (err, result) => {
                err ? reject(err) : resolve(result);
                connection.release();
            })
        })
    }).then((result) => {
        return result
    })
}

//添加数据
const addGoods = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            err ? reject(err) : connection.query(sql, (err, result) => {
                err ? reject(err) : resolve(result);
                connection.release();
            })
        })
    }).then((result) => {
        return result
    })
}

module.exports = {
    listAll,
    addGoods
}