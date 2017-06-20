/**
 * Created by admin on 2016-09-23.
 */

'use strict';

var s_route = require('./lib/route');
var s_redis = require('./lib/redis');
//var s_mysql = require('./lib/mysql');
var s_orm = require('./lib/orm');
global.rediscomm = s_redis;

module.exports = function () {
    return {
        run: function (app, callback) {
            s_route.loadRoute(app);
            s_redis.init();
            s_orm.connect(callback);
        }
    }
}();

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

/**
 * 微信操作对象
 */
var s_weixin = require('./wechat/base');

var weixin = function () {

};

module.exports.wx = weixin;

weixin.prototype.register = function *(next) {
    yield s_weixin.register(this, next);
}

weixin.prototype.getOpenidByCode = function *(next) {
    yield s_weixin.getOpenidByCode(this, next);
}

weixin.prototype.getUserInfo = function *(openid) {
    return yield s_weixin.getUserInfo(openid);
}

weixin.prototype.getUserList = function *(openid) {
    return yield s_weixin.getUserList(openid);
}

weixin.prototype.registerJsSdk = function *(url) {
    return yield s_weixin.registerJsSdk(url);
}

weixin.prototype.registerPayJsSdk = function *(jsonparams) {
    return yield s_weixin.registerPayJsSdk(jsonparams);
}

weixin.prototype.sendTemplateMsg = function *(content) {
    return yield s_weixin.sendTemplateMsg(content);
}
