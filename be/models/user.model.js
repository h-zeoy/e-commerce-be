const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'commerce'
});

// 插入操作
const save = (data) => {
  let {
    username,
    password
  } = data
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query(`INSERT INTO user(username, password) VALUES ("${username}", "${password}" )`, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    var dataString = JSON.stringify(result);
    var result = JSON.parse(dataString);
    return result
  })
}

const findOne = (username) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `SELECT * FROM user where username = "${username}"` , (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    var dataString = JSON.stringify(result);
    var result = JSON.parse(dataString);

    return result
  })
}

module.exports = {
  save,
  findOne
}