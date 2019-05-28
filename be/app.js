var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var positionRouter = require('./routes/baby')
var qiniuRouter = require('./routes/qiniu')
var goodsRouter = require('./routes/goods')
var babyRouter = require('./routes/baby')
var addressRouter = require('./routes/address')
// var addressRouter = require('./routes/address');
var app = express();
var bodyParser = require('body-parser');
//handle request entity too large
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// var allowCrossDomain = function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Methods', 'GET, POST');
//   res.header('Access-Control-Allow-Headers', 'content-Type');
//   res.header('Access-Control-Allow-Credentials', 'true');
// }
// app.use(allowCrossDomain);

app.use('/', indexRouter);

app.use('/api/users', usersRouter);
app.use('/api/baby', babyRouter);
app.use('/api/qiniu', qiniuRouter)
app.use('/api/goods', goodsRouter)
app.use('/api/address', addressRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
