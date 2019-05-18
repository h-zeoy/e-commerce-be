const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'commerce'
});
const query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
                return;
            }
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result);
                }
            })
            connection.release();
        })
    })
}
const transaction = (sqlArr) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            }
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err)
                }
                sqlArr.map((item, index) => {
                    query(item).catch((err) => {
                        connection.rollback(() => {
                            reject(err)
                        })
                    })
                })
                connection.commit((err) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err)
                        })
                    }
                })
                connection.release();
            })
        })
    })
}
module.exports = {
    pool,
    query,
    transaction
}