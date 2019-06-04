const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const auth = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers','X-Root-Auth-Token');
  let token = req.header('X-Root-Auth-Token')
  let cert = fs.readFileSync(path.resolve(__dirname, '../keys/public.key'))
  jwt.verify(token, cert, (err, decoded) => {
    if (decoded) {
      console.log(decoded);
      next(decoded.username)
    } else {
      res.render('user.view.ejs', {
        success: JSON.stringify(false),
        data: JSON.stringify({
            msg: '请登陆'
        }),
        code: JSON.stringify(101),
    })
    }
  })
}

module.exports = {
  auth
}