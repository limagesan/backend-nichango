var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var log4js = require('log4js');
var logger = log4js.getLogger();


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
