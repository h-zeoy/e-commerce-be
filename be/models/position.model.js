const moment = require('moment')
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
  data.createTime = moment().format('YYYY年MM月DD日 HH:mm');
  // let {
  //   positionName,
  //   companyName,
  //   city,
  //   salary,
  //   createTime,
  //   companyLogo
  // } = data

  // const position = new Position({
  //   positionName,
  //   companyName,
  //   salary,
  //   city,
  //   createTime,
  //   companyLogo
  // })

  // return position.save()
  //   .then((result) => {
  //     return true
  //   })
  //   .catch((err) => {
  //     return false
  //   })
}

// 查询全部
const listall = ({keywords}) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query(`select * from goods_list where name like  '%${keywords}%'`, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    return result
  })
}

// 查询单条
const listone = (goodsId, type) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query(`select * from goods_list where goodsId = "${goodsId}" AND type = "${type}"`, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    return result
  })
}

// 分页查询
const list = ({
  pageNo,
  pageSize,
  keywords
}) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query(`select * from goods_list where name like  '%${keywords}%' limit ${(pageNo - 1) * pageSize}, ${pageSize}`, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    return result
  })
}

// 下架
// update 表名 set 字段=‘值’【where 条件】
const lowershelf = ({goodsId, type}) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query(`update goods_list set sale = '0' where goodsId = ${goodsId} AND type = "${type}"`, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    console.log(result);
    return result
  })
}

// upperShelf 上架
const uppershelf = ({goodsId, type}) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query(`update goods_list set sale = '1' where goodsId = ${goodsId} AND type = "${type}"`, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    return result
  })
}

// 编辑
const update = (body) => {
  // let {
  //   id,
  //   positionName,
  //   companyName,
  //   salary,
  //   city,
  //   companyLogo
  // } = body

  // let options = body.companyLogo ? {
  //   positionName,
  //   companyName,
  //   salary,
  //   city,
  //   companyLogo
  // } : {
  //   positionName,
  //   companyName,
  //   salary,
  //   city
  // }

  // return Position.findByIdAndUpdate(id, options)
  //   .then((result) => {
  //     return true
  //   })
  //   .catch((err) => {
  //     return false
  //   })
}

module.exports = {
  save,
  listall,
  list,
  listone,
  lowershelf,
  uppershelf,
  update
}