// log4js の読み込み
var log4js = require('log4js');

// ログ出力設定
log4js.configure('logger/log4js.config.json');

// ロガーの生成
var logger = log4js.getLogger('system');
module.exports = logger;