const positionModel = require('../models/position.model')

const list = async (req, res, next) => {
  let {
    pageNo = 1, pageSize = 10, keywords = ''
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('position.view.ejs', {
    ret: JSON.stringify(true),
    data: JSON.stringify({
      result: await positionModel.list({
        pageNo: ~~pageNo,
        pageSize: ~~pageSize,
        keywords
      }),
      total: (await positionModel.listall({
        keywords
      })).length
    })
  })
}

const listall = async (req, res, next) => {
  let {
    keywords = ''
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('position.view.ejs', {
    ret: JSON.stringify(true),
    data: JSON.stringify(await positionModel.listall({
      keywords
    }))
  })
}

const listone = async (req, res, next) => {
  let {
    goodsId,
    type
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  let result = await positionModel.listone({goodsId, type});
  if (result.length!==0) {
    res.render('position.view.ejs', {
      ret: JSON.stringify(true),
      data: JSON.stringify(result)
    })
  } else {
    res.render('position.view.ejs', {
      ret: JSON.stringify(false),
      data: JSON.stringify({msg: '数据不存在'})
    })
  }
  
}

const save = async (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf8')
  let {type, channel, imgUrl, saleTime, stopSaleTime} = req.body.params;
  req.body.params['imgUrl'] = imgUrl.join(',');
  var codeType = "", codeChannel = "";
  var  typeVal = 0, channelVal = 0;
  var time = String(new Date().getTime());
  var fourTime = time.substr(time.length-4);
  req.body.params['goodsId'] = Math.random().toString(36).substr(6) + Date.now().toString(36).substr(6);
  switch(type) {
    case '童装': codeType = '1001', typeVal = 0; break;
    case '居家': codeType = '1002', typeVal = 1; break;
    case '美食': codeType = '1003', typeVal = 2; break;
    case '母婴': codeType = '1004', typeVal = 3; break;
    case '女装': codeType = '1005', typeVal = 4; break;
    case '鞋包': codeType = '1006', typeVal = 5; break;
    case '母婴': codeType = '1007', typeVal = 6; break;
    case '美妆': codeType = '1008', typeVal = 7; break;
    case '进口': codeType = '1009', typeVal = 8; break;
  }
  switch(channel) {
    case '9.9包邮': codeChannel = '00', channelVal = 0; break;
    case '限时秒杀': codeChannel = '11', channelVal = 1; break;
    case '新品特惠': codeChannel = '22', channelVal = 2; break;
    case '今日特卖': codeChannel = '33', channelVal = 3; break;
  }
  req.body.params['channel'] = channelVal;
  req.body.params['type'] = typeVal;
  req.body.params['code'] = codeType + codeChannel + fourTime;
  req.body.params['sale'] = 0;
  req.body.params['person'] = 0;
  let result = await positionModel.save(req.body.params);
  
  if (result) {
    res.render('position.view.ejs', {
      ret: JSON.stringify(true),
      data: JSON.stringify({
        msg: '商品添加成功'
      })
    })
  } else {
    res.render('position.view.ejs', {
      ret: JSON.stringify(false),
      data: JSON.stringify({
        msg: '商品添加失败'
      })
    })
  }
}

const update = async (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf8')
  let result = await positionModel.update(req.body)
  if (result) {
    res.render('position.view.ejs', {
      ret: JSON.stringify(true),
      data: JSON.stringify({
        msg: '商品修改成功'
      })
    })
  } else {
    res.render('position.view.ejs', {
      ret: JSON.stringify(false),
      data: JSON.stringify({
        msg: '商品修改失败'
      })
    })
  }
}

const lowershelf = async (req, res, next) => {
  let { goodsId } = req.query;
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('position.view.ejs', {
    ret: JSON.stringify(true),
    data: JSON.stringify(await positionModel.lowershelf({ goodsId }))
  })
}

const uppershelf = async (req, res, next) => {
  let { goodsId } = req.query;
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('position.view.ejs', {
    ret: JSON.stringify(true),
    data: JSON.stringify(await positionModel.uppershelf({ goodsId }))
  })
}

const remove = async (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf8')
  let id = req.body.id
  let result = await positionModel.remove(id)
  if (result) {
    res.render('position.view.ejs', {
      ret: JSON.stringify(true),
      data: JSON.stringify({
        msg: 'succ'
      })
    })
  } else {
    res.render('position.view.ejs', {
      ret: JSON.stringify(false),
      data: JSON.stringify({
        msg: 'fail'
      })
    })
  }
}

module.exports = {
  list,
  listone,
  listall,
  save,
  lowershelf,
  uppershelf,
  update
}