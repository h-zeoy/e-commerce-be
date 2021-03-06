const moment = require('moment');
const db = require('../utils/db');


const save = async (str, data) => {
  data['createTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
  // 1账户密码注册 2 手机号注册
  var sqlArr = [];
  if (String(str)=== '1') {
    let { uid, username, password, createTime } = data;
    sqlArr = [
      `insert into users (uid, createTime, updateTime)values (${uid}, '${createTime}', '${createTime}')`,
      `insert into userInfo (id, username, userPass, money)values (${uid}, '${username}', '${password}', '0')`]
  } else {
    let { uid, tel, code, password, createTime } = data;
    sqlArr = [
      `insert into users (uid, createTime, updateTime)values (${uid}, '${createTime}', '${createTime}')`,
      `insert into userInfo (id, tel, code, codePass, money)values (${uid}, '${tel}', ${code}, '${password}', '0')`]
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
  console.log(str, user);
  /*
    str === 1 手机号 username
    str === 2 手机号 tel 判断手机号是否存在 获取uid用  手机号 tel 判断手机号是否存在 获取code password
  */
  var sql = String(str) === '1'
    ? `SELECT * FROM userInfo where username = "${user}"`
    : `SELECT * FROM userInfo where tel = ${user}`;
  
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

//  获取最大uid
const getUid = (username) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select max(uid) as id from users;` , (err, result) => {
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
const secUid = (str, tel) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select id from userInfo where ${str} = '${tel}'` , (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    console.log('result', str,tel);
    var dataString = JSON.stringify(result);
    var result = JSON.parse(dataString);
    return result;
  })
}

// 修改金额
const deMoney = (uid, money) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      }
      db.query(`update userinfo set money='${money}'   where id = ${uid}`).catch((err) => {
        callback(err, null);
        reject(err);
        return;
      }).then((result) => {
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
        })
      })
    })
  }).then((result) => {
    var dataString = JSON.stringify(result);
    var result = JSON.parse(dataString);
    return {
      result,
      flag: true
    };
  })
}

// 修改金额
const selectMoney = (uid) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query( `select money from userinfo   where id = ${uid}` , (err, result) => {
          err ? reject(err) : resolve(result);
          connection.release();
      })
    })
  }).then((result) => {
    
    var dataString = JSON.stringify(result);
    var result = JSON.parse(dataString);
    console.log('result', result);
    return (result[0].money);
  })
}

// 根据手机号查询 code password
// 查询uid
const sectelcode = (tel) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select code, codePass from userInfo where tel = '${tel}'` , (err, result) => {
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
    `UPDATE users set updateTime = '${createTime}' where uid = ${uid}`,
    `insert into userInfo (id, userPass)values (${uid}, '${password}')`];
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
        err ? reject(err) : connection.query( `select userPass from userInfo where id = (select uid from users where tel = '${tel}');` , (err, result) => {
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

//查询是否有支付密码
const isPsyPass = (uid) => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `select payPass from userinfo where id = ${uid};` , (err, result) => {
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

//添加支付密码
const addPayPass = (uid, pass) => {
  console.log(uid, pass)
  let createTime  = moment().format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query( `UPDATE userinfo set payPass='${pass}' where id = ${uid};` , (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    var dataString = JSON.stringify(result);
    var result = JSON.parse(dataString);
    return {
      flag: true
    };
  })
}

const addUserInfo = () => {
  return new Promise((resolve, reject) => {
    db.pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query( `select userPass from userInfo where id = (select uid from users where tel = '${tel}');` , (err, result) => {
          err ? reject(err) : resolve(result);
          connection.release();
      })
    })
  })
}

module.exports = {
  save,
  findOne,
  getUid,
  secUid,
  addPass,
  isPass,
  sectelcode,
  addUserInfo,
  isPsyPass,
  addPayPass,
  deMoney,
  selectMoney
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