const goodsModel = require('../models/goods.model')

const list = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  let {
    pageNo = 1, pageSize = 10, keywords = ''
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('goods.view.ejs', {
    success: JSON.stringify(true),
    data: JSON.stringify({
      result: await goodsModel.list({
        pageNo: ~~pageNo,
        pageSize: ~~pageSize,
        keywords
      }),
      total: (await goodsModel.listall({
        keywords
      })).length
    }),
    code: JSON.stringify(0)
  })
}

const listall = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  let {
    keywords = ''
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('goods.view.ejs', {
    success: JSON.stringify(true),
    data: JSON.stringify(await goodsModel.listall({
      keywords
    })),
    code: JSON.stringify(0)
  })
}

const listone = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  let { id } = req.query;
  res.header('Content-Type', 'application/json; charset=utf8')
  let result = await goodsModel.listone({id});
  console.log(result);
  if (result.length!==0) {
    
    res.render('goods.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify(result),
      code: JSON.stringify(0)
    })
  } else {
    res.render('goods.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify({msg: '数据不存在'}),
      code: JSON.stringify(1)
    })
  }
}

const save = async (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf8');
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.header('Content-Type', 'application/json; charset=utf8');
  let {type, channel, imgUrl} = req.body.params;
  req.body.params['imgUrl'] = imgUrl.join(',');
  req.body.params['goodsId'] = Math.random().toString(36).substr(6) + Date.now().toString(36).substr(6);
  var codeType = "";var codeChannel = "";var  typeVal = 0;var channelVal = 0;
  var fourTime = String(new Date().getTime()).substr(String(new Date().getTime()).length-4);
  switch(type) {
    case '童装': codeType = '1000', typeVal = 0; break;
    case '居家': codeType = '1001', typeVal = 1; break;
    case '美食': codeType = '1002', typeVal = 2; break;
    case '母婴': codeType = '1003', typeVal = 3; break;
    case '女装': codeType = '1004', typeVal = 4; break;
    case '鞋包': codeType = '1005', typeVal = 5; break;
    case '母婴': codeType = '1006', typeVal = 6; break;
    case '美妆': codeType = '1007', typeVal = 7; break;
    case '进口': codeType = '1008', typeVal = 8; break;
  }
  req.body.params['type'] = typeVal;
  switch(channel) {
    case '全部': codeChannel = '00', channelVal = 0; break;
    case '9.9包邮': codeChannel = '11', channelVal = 1; break;
    case '品牌清仓': codeChannel = '22', channelVal = 2; break;
    case '新品特惠': codeChannel = '33', channelVal = 3; break;
    case '今日特卖': codeChannel = '44', channelVal = 4; break;
  }
  req.body.params['channel'] = channelVal;
  req.body.params['code'] = codeType + codeChannel + fourTime;
  req.body.params['sale'] = 0;
  req.body.params['person'] = 0;
  var id = JSON.parse(JSON.stringify(await goodsModel.maxId()))[0];
  id = id['max(aid)']
  let result = await goodsModel.save(req.body.params);
  if (result) {
    res.render('goods.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify({msg: '数据添加成功'}),
      code: JSON.stringify(0)
    })
  } else {
    var nowId = JSON.parse(JSON.stringify(await goodsModel.maxId()))[0];
    nowId = nowId['max(aid)']
    console.log(nowId);
    if (!new RegExp(nowId).test(id)) {
      await goodsModel.deleteId(nowId);
    }
    res.render('goods.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify({msg: '数据添加失败'}),
      code: JSON.stringify(1)
    })
  }
}

//更新数据
const update = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.set('Content-Type', 'application/json; charset=utf8');
  res.header('Content-Type', 'application/json; charset=utf8');
  let {channel} = req.body.params;
  var channelVal = 0;
  switch(channel) {
    case '全部': codeChannel = '00', channelVal = 0; break;
    case '9.9包邮': codeChannel = '11', channelVal = 1; break;
    case '品牌清仓': codeChannel = '22', channelVal = 2; break;
    case '新品特惠': codeChannel = '33', channelVal = 3; break;
    case '今日特卖': codeChannel = '44', channelVal = 4; break;
  }
  req.body.params['channel'] = channelVal;
  let result = await goodsModel.update(req.body.params);

  if (result) {
    res.render('goods.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify({msg: '数据修改成功'}),
      code: JSON.stringify(0)
    })
  } else {
    res.render('goods.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify({msg: '数据修改失败'}),
      code: JSON.stringify(1)
    })
  }
}
const lowershelf = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  let { goodsId } = req.query;
  res.header('Content-Type', 'application/json; charset=utf8')
  let result = await goodsModel.lowershelf({ goodsId });
  console.log(result);
  if (result) {
    res.render('goods.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify({msg: '已下架'}),
      code: JSON.stringify(0)
    })
  } else{
    res.render('goods.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify({msg: '下架失败'}),
      code: JSON.stringify(1)
    })
  }
  
}

const uppershelf = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  let { goodsId } = req.query;
  res.header('Content-Type', 'application/json; charset=utf8')
  let result = await goodsModel.uppershelf({ goodsId });
  
  if (result) {
    res.render('goods.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify({msg: '售卖中'}),
      code: JSON.stringify(0)
    })
  } else{
    res.render('goods.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify({msg: '售卖失败'}),
      code: JSON.stringify(1)
    })
  }
}

module.exports = {
    list,
    listall,
    listone,
    save,
    update,
    lowershelf,
    uppershelf,
    
}
