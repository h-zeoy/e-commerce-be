const qiniuModel = require('../models/qiniu.model');

const cloneupload = (req, res, next) => {
  let { imgData, imgName } = req.body
  res.header('Content-Type', 'application/json; charset=utf8')
  qiniuModel.cloneupload({imgData, imgName}).then((_) => {
    res.render('qiniu.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify({ status: '200', msg: '上传成功', imageUrl: _ })
    })
  }).catch((err) => {
    res.render('qiniu.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify(err)
    })
  })
  
}

const moreupload = async (req, res, next) => {
  let { imgData, imgName } = req.body
  res.header('Content-Type', 'application/json; charset=utf8')
  qiniuModel.moreupload({imgData, imgName}).then((_) => {
    res.render('qiniu.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify({ status: '200', msg: '上传成功', imageUrl: _ })
    })
  }).catch((err) => {
    res.render('qiniu.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify(err)
    })
  })
  
}
module.exports = {
  cloneupload,
  moreupload
}