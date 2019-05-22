// 生成私钥：
// ssh-keygen -t rsa -b 2048 -f private.key

// 生成公钥：
// openssl rsa -in private.key -pubout -outform PEM -out public.key

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const fs = require('fs')
const path = require('path')
const codeModel = require('../models/code.model');

const getUid = async (req, res, next) => {
  let _ = await userModel.getUid();
  let uid = 700000;
  _[0].id ? uid = Number(_[0].id) + 1 : ''
  return uid;
}

// 注册 将code 并以code为密码
const signup = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Content-Type', 'application/json; charset=utf8');
  var params = {};
  var user = []
  var reuser = {};
  var msg = {}
  if (String(req.body.way) === '1') {
    var {
      username,
      password,
      way
    } = req.body
    user = await userModel.findOne(way, username);
    reuser['username'] = username;
    msg['msg'] = '用户名存在';
  } else {
    var {
      tel,
      code,
      way
    } = req.body
    user = await userModel.findOne(way, tel)
    reuser['tel'] = tel;
    msg['msg'] = '手机号已注册';
  }
  if (user.length !== 0) {
    res.render('user.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify(msg),
      code: JSON.stringify(1),
    })
  } else {
    params['uid'] = await getUid();
    if (String(req.body.way) === '1') {
      params['username'] = username;
      params['password'] = await genBcryptPwd(password);
    } else {
      params['tel'] = tel;
      params['code'] = code;
      params['password'] = await genBcryptPwd(code);
    }
    let result = await userModel.save(way, params);
    if (result) {
      res.render('user.view.ejs', {
        success: JSON.stringify(true),
        data: JSON.stringify(reuser),
        code: JSON.stringify(0),
      })
    } else {
      res.render('user.view.ejs', {
        success: JSON.stringify(false),
        data: JSON.stringify({
          msg: '注册失败'
        }),
        code: JSON.stringify(1),
      })
    }
  }
}
// 手机号注册 后 可以添加密码
const addPass = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Content-Type', 'application/json; charset=utf8');
  let {
    tel,
    password
  } = req.body;
  let uid = (await userModel.secUid(tel))[0].uid;
  password = await genBcryptPwd(password);
  let _ = await userModel.addPass(uid, password);
  if (_) {
    res.render('user.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify({
        msg: '密码添加成功'
      }),
      code: JSON.stringify(0),
    })
  } else {
    res.render('user.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify({
        msg: '密码添加失败'
      }),
      code: JSON.stringify(1),
    })
  }
}

// 手机号密码登录 先要判断手机号是否注册 然后判断是否填写密码
// 判断是否填写密码
const isPass = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Content-Type', 'application/json; charset=utf8');
  let {
    tel,
    password
  } = req.body;
  let _ = await userModel.isPass(tel);
  if (_.length !== 0) {
    res.render('user.view.ejs', {
      success: JSON.stringify(false),
      data: JSON.stringify({
        msg: '尚未填写密码,请手机号验证码登录'
      }),
      code: JSON.stringify(1),
    })
  } else {
    res.render('user.view.ejs', {
      success: JSON.stringify(true),
      data: JSON.stringify(_[0]),
      code: JSON.stringify(1),
    })
  }
  return _;
}


// way === 1 密码登录  === 2 验证码登录
const signin = async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header('Content-Type', 'application/json; charset=utf8');
  // 
  /*
  way === 1 密码登录 
  用户名 密码
  手机号密码登录
  判断是手机号 还是 用户名  手机号纯数字 
  纯数字 ? 手机号 : 用户名

  way === 2 手机验证码登录
  手机验证码 发送验证码 验证验证码  正确 到数据库 根据手机号找的code passwo 验证
  错误 则显示 密码错误或者.....
  手机号 判断 有没有密码 没有密码 弹出 手机号验证登录  有密码 根据手机号 找到 密码

   */
  let {
    tel,
    password,
    username,
    code,
    TemplateCode
  } = req.body
  if (String(req.body.way) === '1') {
    if (/^[0-9]+$/.test(tel)) {
      let _ = await telSign(tel, password);
      _.flag ?
        res.render('user.view.ejs', {
          success: JSON.stringify(true),
          data: JSON.stringify({
            token: _.token,
            tel: _.tel
          }),
          code: JSON.stringify(0),
        }) :
        res.render('user.view.ejs', {
          success: JSON.stringify(false),
          data: JSON.stringify({
            msg: _.msg
          }),
          code: JSON.stringify(1),
        })
    } else {
      let _ = await userSign(username, password);
      if (_.flag) {
        res.render('user.view.ejs', {
          success: JSON.stringify(true),
          data: JSON.stringify({
            token: _.token,
            tel: _.tel
          }),
          code: JSON.stringify(0),
        })
      } else {
        res.render('user.view.ejs', {
          success: JSON.stringify(false),
          data: JSON.stringify({
            msg: _.msg
          }),
          code: JSON.stringify(1),
        })
      }

    }
  } else {
    console.log('验证码登录');
    // 先判断手机号是否存在
    let _ = await telCodeSign(tel, code, TemplateCode);
    if (_.flag) {
      console.log(_);
      res.render('user.view.ejs', {
        success: JSON.stringify(true),
        data: JSON.stringify({
          token: _.token,
          tel: _.tel
        }),
        code: JSON.stringify(0),
      })
    } else {
      res.render('user.view.ejs', {
        success: JSON.stringify(false),
        data: JSON.stringify({
          msg: _.msg
        }),
        code: JSON.stringify(1),
      })
    }

  }
}

async function telCodeSign(tel, code, TemplateCode) {
  let _ = await userModel.findOne(3, tel);
  var flag = false;
  if (_.length !== 0) {
    flag = true;
    let SendDate = getyyyyMMdd();
    let sec = await codeModel.getDetail(tel, SendDate, TemplateCode, code);
    if (sec.flag) {
      // console.log(sec.data.OutId);
      let _ = await userModel.sectelcode(tel);
      let password = String(_.code);
      let userPassword = _.password;
      if (await comparePassword({
          password,
          userPassword
        })) {
        flag = true;
        let token = genToken(tel);
        return {
          token,
          tel,
          flag,
        }
      } else {
        return {
          msg: '登录失败',
          flag: false
        }
      }

    } else {
      flag = false;
      return {
        flag,
        msg: sec.msg
      }
    }
  } else {
    return {
      flag,
      msg: '手机号未注册,请前往注册'
    }
  }

}

async function userSign(username, password) {
  let _ = await userModel.findOne(1, username);
  var flag = false;
  if (_.length !== 0) {
    flag = true;
    let userPassword = _[0].password;
    console.log(_[0], 'user');
    if (await comparePassword({
        password,
        userPassword
      })) {
      let token = genToken(username);
      return {
        flag,
        token,
        username
      }
    } else {
      flag = false;
      return {
        flag,
        msg: '用户名或密码错误'
      }
    }
  } else {
    return {
      flag,
      msg: '用户名不存在'
    }
  }

}
async function telSign(tel, password) {
  // 判断手机号是否存在 
  let _ = await userModel.findOne(2, tel);
  var flag = false;
  if (_.length === 0) {
    return {
      flag: false,
      msg: '手机号未注册,请前往注册'
    };
  } else {
    let _ = await userModel.isPass(tel);
    if (_.length !== 0) {
      userPassword = _[0].password
      if (await comparePassword({
          password,
          userPassword
        })) {
        flag = true;
        let token = genToken(tel);
        return {
          token,
          tel,
          flag,
        }
      } else {
        return {
          msg: '用户名或密码错误',
          flag
        }
      }
    } else {
      return {
        msg: '尚未填写密码,请手机号验证码登录',
        flag
      }
    }
  }

}

function genBcryptPwd(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        resolve(hash)
      })
    })
  })
}

function comparePassword({
  password,
  userPassword
}) {
  return new Promise((resovle, reject) => {
    bcrypt.compare(password, userPassword, function (err, res) {
      resovle(res)
    })
  })
}

function genToken(username) {
  let cert = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'))
  let token = jwt.sign({
    username
  }, cert, {
    algorithm: 'RS256'
  })
  return token
}

module.exports = {
  signup,
  signin,
  getUid,
  isPass,
  addPass
}

function getyyyyMMdd() {
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
  String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
  var yyyyMMdd = curr_year + "" + curr_month + "" + curr_date;
  return yyyyMMdd;
}



// const signup = async (req, res) => {
//   res.header('Content-Type', 'application/json; charset=utf8')
//   let { username, password } = req.body
//   let user = await userModel.findOne(username)
//   console.log(user)
//   if (user.length !== 0) {
//     res.render('user.view.ejs', {
//       success: JSON.stringify(false),
//       data: JSON.stringify({msg: '用户名存在.'}),
//       code: JSON.stringify(1),
//     })
//   } else {
//     let result = await userModel.save({
//       username,
//       password: await genBcryptPwd(password),
//       uid
//     })

//     if (result) {
//       res.render('user.view.ejs', {
//         success: JSON.stringify(true),
//         data: JSON.stringify({
//           username
//         }),
//         code: JSON.stringify(0),
//       })
//     } else {
//       res.render('user.view.ejs', {
//         success: JSON.stringify(false),
//         data: JSON.stringify({msg: 'fail'}),
//         code: JSON.stringify(1),
//       })
//     }
//   }
// }

// const signin = async (req, res) => {
//   res.header('Content-Type', 'application/json; charset=utf8')
//   const { username, password } = req.body
//   let user = await userModel.findOne(username)
//   let userPassword = user[0].password;
//   console.log(user, userPassword);
//   if (user) {
//     console.log(await comparePassword({password, userPassword}));
//     if(await comparePassword({password, userPassword})) {
//       let token = genToken(username)
//       res.render('user.view.ejs', {
//         success: JSON.stringify(true),
//         data: JSON.stringify({
//           token,
//           username
//         }),
//         code: JSON.stringify(0),
//       })
//     } else {
//       res.render('user.view.ejs', {
//         success: JSON.stringify(false),
//         data: JSON.stringify({msg: '用户名或密码错误.'}),
//         code: JSON.stringify(1),
//       })
//     }
//   } else {
//     res.render('user.view.ejs', {
//       success: JSON.stringify(false),
//       data: JSON.stringify({msg: '用户名或密码错误.'}),
//       code: JSON.stringify(1),
//     })
//   }
// }