var mongoose = require('mongoose');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  logger.debug('connection seccess');
  // we're connected!
});

module.exports = mongoose;