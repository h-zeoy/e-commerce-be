const moment = require('moment');
const db = require('../utils/db');
var async = require('async');
// var connection =  mysql.createConnection( { multipleStatements: true } );

const addressMaxId = async () => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(`select max(id) from address`, (err, result) => {
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

const add = (data) => {
  data['createTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
  let {
    uid,
    addressId,
    addressInfo,
    createTime,
    way
  } = data;
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      }
      if (String(way) === '1') {
        connection.beginTransaction((err) => {
          if (err) {
            console.log(err);
            reject(err)
          }
          var task1 = function (callback) {
            db.query(`UPDATE users SET addressId = ${addressId}, updateTime = '${createTime}' where uid = ${uid}`).catch((err) => {
              callback(err, null);
              reject(err);
              return;
            }).then((result) => {
              console.log('第一次插入成功!');
              callback(null, result);
            })
          }
          var task2 = function (callback) {
            db.query(`insert into address (id, addressInfo, createTime, updateTime) VALUES (${addressId}, '${addressInfo}', '${createTime}', '${createTime}')`).catch((err) => {
              callback(err, null);
              reject(err);
              return;
            }).then((result) => {
              console.log('第二次插入成功!');
              callback(null, result);
            })
          }
          async.series([task1, task2], function (err, result) {
            if (err) {
              reject(err);
              //回滚
              connection.rollback(function () {
                console.log('出现错误,回滚!');
                //释放资源
                connection.release();
              });
              return;
            }
            //提交
            connection.commit(function (err, result) {
              if (err) {
                reject(err);
                return;
              } else {
                resolve(result);
              }

              console.log('成功,提交!');
              //释放资源
              connection.release();
            });
          })
        })
      } else {
        console.log(12323);
        connection.query(`UPDATE address SET addressInfo = '${addressInfo}', updateTime = '${createTime}' WHERE id = ${addressId}`, (err, result) => {
          err ? reject(err) : resolve(result);
          connection.release();
        })
      }

    })
  }).catch((err) => {
    console.log(err);
    return {
      flag: false,
      err,
    }
  }).then((result) => {
    console.log(result);
    return {
      flag: true,
      result,
    }
  })
}

const selectId = (uid) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(`SELECT addressId FROM users WHERE uid = ${uid}`, (err, result) => {
        err ? reject(err) : resolve(result);
        connection.release();
      })
    })
  }).then((result) => {
    return JSON.parse(JSON.stringify(result));
  })
}

const selectInfo = (id) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(`SELECT addressInfo FROM address WHERE id = ${id}`, (err, result) => {
        err ? reject(err) : resolve(result);
        connection.release();
      })
    })
  }).then((result) => {
    return {
      flag: true,
      result: JSON.parse(JSON.stringify(result))[0]
    }
  }).catch((err) => {
    return {
      flag: false,
      err
    }
  })
}

const update = (id, addressInfo) => {
  let sql = `UPDATE address SET addressInfo = '${addressInfo}' where id = ${id}`;
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(sql, (err, result) => {
        err ? reject(err) : resolve(result);
        connection.release();
      })
    })
  }).then((result) => {
    return {
      flag: true
    }
  }).catch((err) => {
    return {
      flag: false,
      err
    }
  })
}

const remove = (uid, id) => {
  let createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.log(err);
          reject(err)
        }
        var task1 = function (callback) {
          db.query(`DELETE FROM address WHERE id = ${id}`).catch((err) => {
            callback(err, null);
            reject(err);
            return;
          }).then((result) => {
            console.log('删除成功!');
            callback(null, result);
          })
        }
        var task2 = function (callback) {
          db.query(`UPDATE users SET addressId = 0, updateTime = '${createTime}' where uid = ${uid}`).catch((err) => {
            callback(err, null);
            reject(err);
            return;
          }).then((result) => {
            console.log('修改成功!');
            callback(null, result);
          })
        }
        async.series([task1, task2], function (err, result) {
          if (err) {
            reject(err);
            //回滚
            connection.rollback(function () {
              console.log('出现错误,回滚!');
              //释放资源
              connection.release();
            });
            return;
          }
          //提交
          connection.commit(function (err, result) {
            if (err) {
              reject(err);
              return;
            } else {
              resolve(result);
            }

            console.log('成功,提交!');
            //释放资源
            connection.release();
          });
        })
      })
    })
  }).catch((err) => {
    console.log(err);
    return {
      flag: false,
      err,
    }
  }).then((result) => {
    console.log(result);
    return {
      flag: true,
    }
  })
}


module.exports = {
  add,
  selectId,
  addressMaxId,
  selectInfo,
  update,
  remove
}