const moment = require('moment');
const db = require('../utils/db');


const save = async (str, data) => {
  data['createTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
  // 1账户密码注册 2 手机号注册
  var sqlArr = [];
  if (String(str)=== '1') {
    let { uid, username, password, createTime } = data;
    sqlArr = [
      `insert into all_users (uid, username, createTime, updateTime)values (${uid}, '${username}', '${createTime}', '${createTime}')`,
      `insert into user_name (unid, username, password)values (${uid}, '${username}', '${password}')`]
  } else {
    let { uid, tel, code, password, createTime } = data;
    sqlArr = [
      `insert into all_users (uid, tel, createTime, updateTime)values (${uid}, ${tel}, '${createTime}', '${createTime}')`,
      `insert into user_tel (utid, tel, code, password)values (${uid}, ${tel}, ${code}, '${password}')`]
  }
  var flag = true;
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
              sqlArr.map((item) => {
                  connection.query(item, (err) => {
                      if (err) {
                          flag = false;
                          reject(err);
                      } 
                  })
              })
              connection.commit((err,result) => {
                  if (err) {
                      connection.rollback(() => {
                          reject(err)
                      })
                  } else {
                      resolve(result);
                  }
              })
              connection.release();
          })
      })
  }).catch((err) =>{
      console.log(err);
      return false
  }).then((result) => {
      console.log(result);
      return flag;
  })
}

// 查询
const findOne = (str, user) => {
  var sql = '';
  console.log(str, user);
  /*
    str === 1 手机号 username
    str === 2 手机号 tel 判断手机号是否存在 获取uid用
    str === 3 手机号 tel 判断手机号是否存在 获取code password
  */
  if (String(str) === '1') {
    sql =  `SELECT * FROM user_name where username = "${user}"`
  } else if (String(str) === '2') {
    sql =  `SELECT * FROM all_users where tel = ${user}`
  } else if (String(str) === '3') {
    sql =  `SELECT * FROM user_tel where tel = ${user}`
  }
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( sql , (err, result) => {
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

// 插入操作
// const save = (data) => {
//   let {
//     username,
//     password
//   } = data
//   return new Promise((resolve, reject) => {
//     pool.getConnection((err, connection) => {
//         err ? reject(err) : connection.query(`INSERT INTO user(username, password) VALUES ("${username}", "${password}" )`, (err, result) => {
//             err ? reject(err) : resolve(result);
//             connection.release();
//         })
//     })
//   }).then((result) => {
//     var dataString = JSON.stringify(result);
//     var result = JSON.parse(dataString);
//     return result
//   })
// }
//查询
// const findOne = (username) => {
//   return new Promise((resolve, reject) => {
//     pool.getConnection((err, connection) => {
//         err ? reject(err) : connection.query( `SELECT * FROM user where username = "${username}"` , (err, result) => {
//             err ? reject(err) : resolve(result);
//             connection.release();
//         })
//     })
//   }).then((result) => {
//     var dataString = JSON.stringify(result);
//     var result = JSON.parse(dataString);

//     return result
//   })
// }
//  获取最大uid
const getUid = (username) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select max(uid) as id from all_users;` , (err, result) => {
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

// 查询uid
const secUid = (tel) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select uid from all_users where tel = ${tel}` , (err, result) => {
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

// 根据手机号查询 code password
// 查询uid
const sectelcode = (tel) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select code, password from user_tel where tel = ${tel}` , (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    var dataString = JSON.stringify(result);
    var result = JSON.parse(dataString);
    return result[0];
  })
}


const addPass = async (uid, password) => {
  let createTime  = moment().format('YYYY-MM-DD HH:mm:ss');
  var sqlArr = sqlArr = [
    `UPDATE all_users set updateTime = '${createTime}' where uid = ${uid}`,
    `insert into user_name (unid, password)values (${uid}, '${password}')`];
  var flag = true;
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
              sqlArr.map((item) => {
                  connection.query(item, (err) => {
                      if (err) {
                          flag = false;
                          reject(err);
                      } 
                  })
              })
              connection.commit((err,result) => {
                  if (err) {
                      connection.rollback(() => {
                          reject(err)
                      })
                  } else {
                      resolve(result);
                  }
              })
              connection.release();
          })
      })
  }).catch((err) =>{
      console.log(err.errno);
      return false
  }).then((result) => {
      console.log(result);
      return flag;
  })
}

//查询是否添加过密码
const isPass = (tel) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select * from user_name where unid = (select uid from all_users where tel = ${tel});` , (err, result) => {
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

module.exports = {
  save,
  findOne,
  getUid,
  secUid,
  addPass,
  isPass,
  sectelcode
}