const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'hxy12345678',
    database: 'commerce',
    multipleStatements: true
});

const query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
          err ? reject(err) : connection.query(sql, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
          })
        })
      }).then((result) => {
        var dataString = JSON.stringify(result);
        var result = JSON.parse(dataString);
        return result;
      })
}

const transaction = (sqlArr) => {
    return new Promise((resolve, reject) => {
        db.pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            }
            connection.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                for (let i = 0;i<sqlArr.length;i++) {
                    query(sqlArr[i]).catch((err) => {
                        connection.rollback(function() {
                            console.log('出现错误,回滚!');
                            reject(err)
                            //释放资源
                            connection.release();
                        });
                    })
                }
                connection.commit(function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            console.log('出现错误,回滚!');
                            reject(err)
                            //释放资源
                            connection.release();
                        });
                    }
                    resolve(result) 
                    console.log('成功,提交!');
                })
                connection.release();;
            })
        })
    })
}


module.exports = {
    pool,
    query,
    transaction
};
