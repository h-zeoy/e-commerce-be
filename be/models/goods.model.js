const db = require('../utils/db');
const moment = require('moment')
// 查询全部
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

// 查询单条
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
                case 1: channelVal = '限时秒杀'; break;
                case 2: channelVal = '新品特惠'; break;
                case 3: channelVal = '今日特卖'; break;
            }
            item.type = typeVal;
            item.channel = channelVal;
        })
        return _;
    })
}

// 下架 update 表名 set 字段=‘值’【where 条件】
const lowershelf = ({
    goodsId
}) => {
    let sql = `UPDATE list_data SET sale = '0' where lid = (select aid  from all_goods where goodsId = '${goodsId}')`;
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
        return true
    }).catch(() =>{
        return false;
    })
}

// upperShelf 上架
const uppershelf = ({
    goodsId
}) => {
    let sql = `UPDATE list_data SET sale = '1' where lid = (select aid  from all_goods where goodsId = '${goodsId}')`;
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
        return true
    }).catch(() =>{
        return false;
    })
}

// 查询最大id
const maxId = () => {
    let sql = 'select max(aid) from all_goods';
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
        return _
    });
}

// 删除数据
const deleteId = (id) => {
    let sql = `delete from all_goods where aid = ${id};`;
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
        return _
    }).catch((err) =>{
        console.log(err)
    })
}

// save 添加数据
const save = async (data) => {
    data['createTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
    let {
        goodsId, type, name,
        thumbnailUrl, price, linePrice,
        saleTime, stopSaleTime, goodsInfo,
        imgUrl, detail, channel, person,
        code, sale,createTime
    } = data;
    console.log(data);
    var id = JSON.parse(JSON.stringify(await maxId()))[0];
    id = id['max(aid)'] + 1;
    var flag = true;
    let sqlArr = [`insert into all_goods (aid, goodsId, type, createTime, updateTime, saleTime, stopSaleTime)values (${id}, '${goodsId}', ${type}, '${createTime}', '${createTime}', '${saleTime}', '${stopSaleTime}')`,
    `insert into list_data (lid, name, thumbnailUrl, price,linePrice, code, channel, sale)values (${id}, '${name}', '${thumbnailUrl}', '${price}', '${linePrice}', '${code}', ${channel},'${sale}')`,
    `insert into list_detail (ldid, goodsInfo, detail, imgUrl, person) values (${id}, '${goodsInfo}', '${detail}', '${imgUrl}', '${person}');`]
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

// update 修改数据
const update = (data) => {
    data['updateTime'] = moment().format('YYYY-MM-DD HH:mm:ss');
    let {
        id, name, updateTime,
        thumbnailUrl, price, linePrice,
        saleTime, stopSaleTime, goodsInfo,
        imgUrl, detail, channel
    } = data;
    var flag = true;
    let sqlArr = [`UPDATE all_goods SET updateTime = '${updateTime}', saleTime = '${saleTime}', stopSaleTime = '${stopSaleTime}' where goodsId = '${id}'`,
    `UPDATE list_data SET name = '${name}', thumbnailUrl = '${thumbnailUrl}', price = '${price}',linePrice = '${linePrice}', channel = '${channel}' where lid = (select aid  from all_goods where goodsId = '${id}')`,
    `UPDATE list_detail SET goodsInfo = '${goodsInfo}', detail = '${detail}', imgUrl = '${imgUrl}' where ldid = (select aid  from all_goods where goodsId = '${id}')`]
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
                            reject(err)
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

module.exports = {
    listall,
    listone,
    list,
    lowershelf,
    uppershelf,
    save,
    update,
    maxId,
    deleteId
}