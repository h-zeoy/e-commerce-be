const moment = require('moment');
const db = require('../utils/db');
var async = require('async');

const orderMaxId = () => {
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

//查询ordeID 
const selectId = (uid) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(`SELECT orderId FROM users WHERE uid = ${uid}`, (err, result) => {
        err ? reject(err) : resolve(result);
        connection.release();
      })
    })
  }).then((result) => {
    return JSON.parse(JSON.stringify(result));
  })
}

const selectInfo = (id) => {
  console.log(id);
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(`SELECT orderInfo FROM orderinfo WHERE id = ${id}`, (err, result) => {
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

const updateStatus = (id, addressInfo) => {
  console.log(id, addressInfo);
  let sql = `UPDATE orderinfo SET orderInfo = '${orderInfo}' where id = ${id}`;
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

const update = (id, orderInfo) => {
  console.log(id, orderInfo);
  let sql = `UPDATE orderinfo SET orderInfo = '${orderInfo}' where id = ${id}`;
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








const create = (data) => {
  data['createTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
  let {
    uid,
    orderId,
    orderInfo,
    createTime,
    way
  } = data;
  console.log(data);
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
            db.query(`UPDATE users SET orderId = ${orderId}, updateTime = '${createTime}' where uid = ${uid}`).catch((err) => {
              callback(err, null);
              reject(err);
              return;
            }).then((result) => {
              console.log('用户添加成功!');
              callback(null, result);
            })
          }
          var task2 = function (callback) {
            db.query(`insert into orderinfo (id, orderInfo, createTime, updateTime) VALUES (${orderId}, '${orderInfo}', '${createTime}', '${createTime}')`).catch((err) => {
              callback(err, null);
              reject(err);
              return;
            }).then((result) => {
              console.log('订单创建成功!');
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
        });
      } else {
        connection.query(`UPDATE orderinfo SET orderInfo = '${orderInfo}', updateTime = '${createTime}' WHERE id = ${orderId}`, (err, result) => {
          if (err) {
            reject(err)
          }else {
            resolve(result)
          }
          connection.release();
        })
      }
    })
  }).then((result) => {
    // console.log(result)
    return {
      flag: true
    }
  }).catch((err) => {
    console.log(err);
    return {
      flag: false,
      err
    }
  })
}

//修改订单状态


module.exports = {
  create,
  selectId,
  orderMaxId,
  selectInfo,
  updateStatus,
  update
}