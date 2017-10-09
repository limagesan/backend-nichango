var express = require('express');
var router = express.Router();
var log4js = require('log4js');
var logger = log4js.getLogger();
var session = require('express-session');
var User = require('../models/user.model');


/* GET home page. */

router.post('/login', function (req, res, next) {
  const resMsg = 'Login succeed ' + req.body.userId;
  logger.debug(req.body);
  User.find({ username: req.body.username, password: req.body.password }, (err, user) => {
    if (err || !user.length) {
      logger.error(err);
      res.status(401).send('Authentication Failed');
      return;
    }
    req.session.username = req.body.username;
    res.json(user);
  });
});

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
