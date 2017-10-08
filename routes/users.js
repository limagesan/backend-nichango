var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var log4js = require('log4js');
var logger = log4js.getLogger();

/* GET users listing. */

router.post('/login', function (req, res, next) {
  const resMsg = 'Login succeed ' + req.body.userId;
  logger.debug(req.body);
  User.find({ username: req.body.username, password: req.body.password }, (err, user) => {
    if (err || !user.length) {
      logger.error(err);
      res.status(401).send('Authentication Failed');
      return;
    }

    res.json(user);
  });
});

/* GET users listing. */
// ユーザー一覧取得
router.get('/', function (req, res, next) {
  User.find({}, (err, users) => {
    if (err) {
      logger.error(err);
      return res.json([]);
    }

    res.json(users);
  });
});

// ユーザー作成
router.post('/', (req, res, next) => {
  logger.info('post', req.body);
  var user = new User(req.body);
  user.save((err) => {
    if (err) {
      logger.error(err);
      return res.send("");
    }

    res.send('new user created');
  });
});

// ユーザー削除
router.delete('/', (req, res, next) => {
  User.remove({ '_id': req.query.id }, (err) => {
    if (err)
      logger.error(err);

    res.send('user removed');
  });
});

// ユーザー更新
router.put('/', (req, res, next) => {
  User.update({ '_id': req.query.id }, req.body, (err) => {
    if (err)
      logger.error(err);

    res.send('user updated');
  })
});

module.exports = router;
