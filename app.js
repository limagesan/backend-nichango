var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('./mongo');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// connect MongoDB
mongoose.connect('mongodb://localhost/timetable');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'timetable', // クッキーIDの暗号化に使用
  resave: false, // セッションにアクセスすると上書きされるオプション
  saveUninitialized: false,  // 未初期化状態のセッションも保持するオプション
  cookie: {
    httpOnly: false, // クライアントがクッキーにアクセスできなくするオプション
    secure: false, // HTTPS使用時にtrue
    maxage: 1000 * 60 * 30 // クッキーの有効期限
  }
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
  res.header("Access-Control-Allow-Credentials", true);
  next()
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use((req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    console.log("DEBUG", req.session);
    var err = new Error('Unauthrized');
    err.status = 401;
    next(err);
  }
});


app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
