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
// const save = (data) => {
//   data['createTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
//   let {
//     goodsId,
//     type,
//     name,
//     thumbnailUrl,
//     price,
//     linePrice,
//     saleTime,
//     stopSaleTime,
//     goodsInfo,
//     person,
//     imgUrl,
//     detail,
//     channel,
//     code,
//     sale,
//     createTime
//   } = data
//   console.log(goodsInfo);
//   let sql = `
//   insert into all_goods (goodsId, type, createTime, updateTime, saleTime, stopSaleTime )
//     values ('${goodsId}', ${type}, '${createTime}', '${createTime}', '${saleTime}', '${stopSaleTime}')
//   insert into list_detail (goodsInfo, detail, imgUrl, person) 
//     values ('${goodsInfo}', '${detail}', '${imgUrl}', '${person}')
//   insert into list_data (name, thumbnailUrl, price,linePrice, code, channel, sale)
//     values ('${name}', '${thumbnailUrl}', '${price}', '${linePrice}', '${code}', ${channel},'${sale}')`;
//   return new Promise((resolve, reject) => {
//     pool.getConnection((err, connection) => {
//       err ? reject(err) : connection.query(sql, (err, result) => {
//         err ? reject(err) : resolve(result);
//         connection.release();
//       })
//     })
//   }).then((result) => {
//     return result
//   }).catch((err) => {
//     console.log(err);
//   })
// }

const save = () => {
  var task1 =  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(sql, (err, result) => {
        err ? reject(err) : resolve(result);
        connection.release();
      })
    })
  });
  var task2 =  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(sql, (err, result) => {
        err ? reject(err) : resolve(result);
        connection.release();
      })
    })
  });
  var task3 =  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      err ? reject(err) : connection.query(sql, (err, result) => {
        err ? reject(err) : resolve(result);
        connection.release();
      })
    })
  });
  Promise.all([task1, task2, task3]).then((result) =>{
    console.log(result);
    connection.rollback(function() {
      console.log('出现错误,回滚!');
      //释放资源
      connection.release();
    });

  }).catch((err) => {
    console.log(err);
  })

}

// 查询全部
const listall = ({keywords}) => {
  let sql = `select a.*, b.name,  b.thumbnailUrl, b.price, b.linePrice, b.code, b.channel, b.sale from all_goods a left join list_data b on a.aid = b.lid where name like '%${keywords}%'`;
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

// 查询单条
const listone = ({goodsId, type}) => {
  let sql = `select a.*,  b.name, b.thumbnailUrl, b.price, b.linePrice, b.code, b.channel, b.sale from( select * from all_goods a where goodsId = '${goodsId}') a left join list_data b on a.aid = b.lid;`;
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

// 分页查询
const list = ({
  pageNo,
  pageSize,
  keywords
}) => {
  let sql = `select a.*, b.name,  b.thumbnailUrl, b.price, b.linePrice, b.code, b.sale, b.channel from all_goods a 
  left join list_data b on a.aid = b.lid where name like '%${keywords}%' limit ${(pageNo - 1) * pageSize}, ${pageSize}`;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        err ? reject(err) : connection.query(sql, (err, result) => {
            err ? reject(err) : resolve(result);
            connection.release();
        })
    })
  }).then((result) => {
    let typeVal = '';
    let channelVal = '';
    console.log(result);
    result.map(function(item, index) {
      switch(item.type) {
        case 0: typeVal = '童装'; break;
        case 1: typeVal = '居家'; break;
        case 2: typeVal = '美食'; break;
        case 3: typeVal = '母婴'; break;
        case 4: typeVal = '女装'; break;
        case 5: typeVal = '鞋包'; break;
        case 6: typeVal = '母婴'; break;
        case 7: typeVal = '美妆'; break;
        case 8: typeVal = '进口'; break;
      }
      switch(item.channel) {
        case 0: channelVal = '9.9包邮'; break;
        case 1: channelVal = '限时秒杀'; break;
        case 2: channelVal = '新品特惠'; break;
        case 3: channelVal = '今日特卖'; break;
      }
      item.type = typeVal;
      item.channel = channelVal;
    })
    return result
  })
}


// 下架
// update 表名 set 字段=‘值’【where 条件】
const lowershelf = ({goodsId}) => {
  let sql = `UPDATE list_data SET sale = '0' where lid = (select aid  from all_goods where goodsId = '${goodsId}')`;
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

// upperShelf 上架
const uppershelf = ({goodsId}) => {
  let sql = `UPDATE list_data SET sale = '1' where lid = (select aid  from all_goods where goodsId = '${goodsId}')`;
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