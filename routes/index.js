var express = require('express');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger();
var User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var users = require('./users');
const httpStatus = require('http-status');
const saltRounds = 10;



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', login);

// ユーザー作成
router.post('/users', createUser);
router.options('/users', (req, res, next) => {
  res.status(200).send();
})

router.use((req, res, next) => {  // eslint-disable-line consistent-return
  const token = req.headers.authorization ||
    req.body.token ||
    req.query.token ||
    req.headers.access_token;
  if (!token) {
    return next({
      message: 'No token provided.',
      status: httpStatus.FORBIDDEN,
    });
  }

  jwt.verify(token, process.env.SECRET || 'secret', (err, decoded) => { // eslint-disable-line consistent-return
    if (err) {
      return next({
        message: 'Invalid Token.',
        status: httpStatus.UNAUTHORIZED,
      });
    }
    req.decoded = decoded;
    next();
  });
});


router.use('/users', users);

function createUser(req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, (err, password) => {
    if (err) throw err;

    const user = new User({
      username: req.body.username,
      password,
    });
    console.log('user', user);
    // when valid -> create token
    var token = jwt.sign({
      username: user.username,
      password: user.password
    }, 'secret', {
        expiresIn: '24s'
      });

    user.save()
      .then((savedUser) => {
        res.json({
          success: true,
          message: 'Authentication successfully finished.',
          username: user.username,
          token: token
        });
      });
  });
}

function compareHash(str, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(str, hash, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}


function login(req, res, next) {
  User.findOne({ username: req.body.username }, async function (err, user) {
    if (err) throw err;

    // validation
    if (!user) {
      res.status(401);
      res.json({
        success: false,
        message: 'Authentication failed. User not found.',
      });
      return;
    }

    const auth = await compareHash(req.body.password, user.password);
    if (!auth) {
      res.status(401);
      res.json({
        success: false,
        message: 'Authentication failed. Wrong password.',
        status: 401,
      });
      return;
    }

    // when valid -> create token
    var token = jwt.sign({
      username: user.username,
      password: user.password
    }, process.env.SECRET || 'secret', {
        expiresIn: '24h'
      });

    res.json({
      success: true,
      message: 'Authentication successfully finished.',
      token: token
    });
  });
}

module.exports = router;
