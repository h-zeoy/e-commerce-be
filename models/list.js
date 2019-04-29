const pool = require('../utils/database');

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
module.exports = {
    listAll
}