const db = require('../utils/db');
const moment = require('moment')
//首页接口
const todaysale = (
  channel, type
) => {
  console.log(channel, type);
  let sql = '';
  if (type !== '') {
    sql = `select a.*, b.name,  b.thumbnailUrl, b.price, b.linePrice, b.code, b.channel, b.sale from all_goods a left join list_data b on a.aid = b.lid where channel = ${channel} AND type=${type}`;
  } else {
    sql = `select a.*, b.name,  b.thumbnailUrl, b.price, b.linePrice, b.code, b.channel, b.sale from all_goods a left join list_data b on a.aid = b.lid where channel = ${channel}`;
  }
    return new Promise((resolve, reject) => {
        db.pool.getConnection((err, connection) => {
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
    }).then((_) => {
        return _;
    })
}

// 查询单条 详情页
const listone = ({
  id
}) => {
  let sql = `select a.*,  b.name, b.thumbnailUrl, b.price, b.linePrice, b.code, b.channel, b.sale, c.goodsInfo, c.detail, c.person, c.imgUrl from( select * from all_goods a where goodsId = '${id}') a left join list_data b on a.aid = b.lid left join list_detail c on c.ldid = a.aid`;
  return new Promise((resolve, reject) => {
      db.pool.getConnection((err, connection) => {
          if (err) {
              reject(err);
              return;
          }
          connection.query(sql, (err, result) => {
              if (err) {
                  reject(err)
              } else {
                  console.log(result);
                  resolve(result);
              }
          })
          connection.release();
      })
  }).then((_) => {
      return _;
  })
};

// 搜索 根据名字 获取总条数
const listall = ({
  keywords
}) => {
    let sql = `select a.*, b.name,  b.thumbnailUrl, b.price, b.linePrice, b.code, b.channel, b.sale from all_goods a left join list_data b on a.aid = b.lid where name like '%${keywords}%'`;
    return new Promise((resolve, reject) => {
        db.pool.getConnection((err, connection) => {
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
    }).then((_) => {
        return _;
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
        db.pool.getConnection((err, connection) => {
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
    }).then((_) => {
        console.log(_);
        let typeVal = '', channelVal  = '';
        _.map((item) => {
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
                case 1: channelVal = '品牌清仓'; break;
                case 2: channelVal = '新品特惠'; break;
                case 3: channelVal = '今日特卖'; break;
            }
            item.type = typeVal;
            item.channel = channelVal;
        })
        return _;
    })
}

// 购物车列表 添加到购物车 必须登陆 才能打开购物车页面

// 地址列表 必须登陆才能打开我的页面

// 订单列表


module.exports = {
    listall,
    listone,
    list,
    todaysale,
}