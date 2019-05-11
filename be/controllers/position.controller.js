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

const listone = async (req, res) => {
  let {
    goodsId,
    type
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('position.view.ejs', {
    ret: JSON.stringify(true),
    data: JSON.stringify(await positionModel.listone({goodsId, type}))
  })
}

const save = async (req, res, next) => {
  res.set('Content-Type', 'application/json; charset=utf8')
  let result = await positionModel.save(req.body)
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
  let {
    goodsId,
    type
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('position.view.ejs', {
    ret: JSON.stringify(true),
    data: JSON.stringify(await positionModel.lowershelf({
      goodsId,
      type
    }))
  })
}

const uppershelf = async (req, res, next) => {
  let {
    goodsId,
    type
  } = req.query
  res.header('Content-Type', 'application/json; charset=utf8')
  res.render('position.view.ejs', {
    ret: JSON.stringify(true),
    data: JSON.stringify(await positionModel.uppershelf({
      goodsId,
      type
    }))
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