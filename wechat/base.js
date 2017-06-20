/**
 * Created by admin on 2016-11-10.
 */

'use strict';

let safety = require("../lib/safety");
let thunkify = require('thunkify');
let api = require("./api");
let wx_api = new api();
let xml2json = require('xml2js');
let xml2js = xml2json.parseString;

/**
 * 微信注册
 * @param ctx
 * @param next
 */
module.exports.register = function *(ctx, next) {
    var echostr = ctx.query.echostr;
    var signature = ctx.query.signature;
    var timestamp = ctx.query.timestamp;
    var nonce = ctx.query.nonce;
    var token = conf.wechat.token;

    var array = [];
    array.push(token);
    array.push(timestamp);
    array.push(nonce);

    var str = array.sort().toString().replace(/,/g, '');
    str = safety.sha1(str);
    if (str == signature) {
        ctx.signature_token = echostr;
    } else {
        ctx.signature_token = false;
    }
    yield next;
}

/**
 * 根据code获取openid，微信网页授权
 * @param ctx
 * @param next
 */
module.exports.getOpenidByCode = function *(ctx, next) {
    var code = ctx.query.code;
    var url = wx_api.apiurl.getOpenidByCode.format('', '', code);

    var options = {
        url: url,
        method: "get",
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: ''
    }
    var result = yield thunkify(wx_api.requesthttp)(options);
    ctx.openid = result.openid;
    yield next;
}

/**
 * 获取accesstoken
 */
module.exports.getAccessToken = function *(callback) {
    var accesstoken = yield  thunkify(rediscomm.get)('wx_access_token');
    if (!accesstoken) {
        var url = wx_api.apiurl.getAccessToken;
        var options = {
            url: url,
            method: "get",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: ""
        }

        var result = yield thunkify(wx_api.requesthttp)(options);
        accesstoken = result.access_token;
        yield  thunkify(rediscomm.set)('wx_access_token', accesstoken, 7000);
    }
    return accesstoken;
}

/**
 * 根据openid获取粉丝资料
 * @param ctx
 * @param next
 */
module.exports.getUserInfo = function *(openid) {
    var accessToken = yield this.getAccessToken();
    var url = wx_api.apiurl.getUserInfo.format(accessToken, openid);
    var options = {
        url: url,
        method: "get",
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: ''
    }
    return yield thunkify(wx_api.requesthttp)(options);
}

/**
 * 批量获取粉丝列表
 */
module.exports.getUserList = function*(openid) {
    var accessToken = yield this.getAccessToken();
    var url = wx_api.apiurl.getUserList.format(accessToken, openid);
    var options = {
        url: url,
        method: "get",
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: ''
    }
    return yield thunkify(wx_api.requesthttp)(options);
}

/**
 * 获取jssdk_ticket
 */
module.exports.getJssdk_ticket = function *() {
    var jssdkticket = yield  thunkify(rediscomm.get)('wx_jssdk_ticket');
    if (!jssdkticket) {
        var accessToken = yield this.getAccessToken();
        var url = wx_api.apiurl.getjssdkticket.format(accessToken);
        var options = {
            url: url,
            method: "get",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: ''
        }
        let result = yield thunkify(wx_api.requesthttp)(options);
        if (result && result.errcode == 0) {
            jssdkticket = result.ticket;
            yield  thunkify(rediscomm.set)('wx_jssdk_ticket', jssdkticket, 7000);
        }
    }
    return jssdkticket;
}

/**
 * 注册Jssdk
 * @param url
 */
module.exports.registerJsSdk = function *(url) {
    var jssdkticket = yield this.getJssdk_ticket();
    var timestamp = new Date().valueOf();
    var noncestr = "Wm3WZYTPz0wzccnW";
    var sha1_txt = safety.sha1("jsapi_ticket=" + jssdkticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url);
    return {nonceStr: noncestr, timestamp: timestamp, signature: sha1_txt, appid: conf.wechat.appid};
}

/**
 * 注册微信支付jssdk签名
 * @param jsonparams
 */
module.exports.registerPayJsSdk = function *(jsonparams) {
    var _jsApiParam = {};
    _jsApiParam.appId = jsonparams.appid;
    _jsApiParam.nonceStr = jsonparams.nonce_str;

    try {
        if (jsonparams) {
            var str = tourl(jsonparams) + "&key=" + conf.wechat.paykey;
            jsonparams.sign = safety.md5(str).toUpperCase();
            var jsApiParam_xml = toxml(jsonparams);

            var options = {
                url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
                method: "post",
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: jsApiParam_xml
            }
            let result = yield thunkify(wx_api.requesthttp)(options);
            let json_result = yield thunkify(xml2js)(result, {explicitArray: false, ignoreAttrs: true});
            if (json_result && json_result.xml.return_code == "SUCCESS" && !json_result.err_code) {
                _jsApiParam.package = "prepay_id=" + json_result.xml.prepay_id;
                _jsApiParam.signType = "MD5";
                _jsApiParam.timeStamp = (Date.parse(new Date()) / 1000).toString();
                _jsApiParam.paySign = safety.md5(tourl(_jsApiParam) + "&key=" + conf.wechat.paykey).toUpperCase();
                return _jsApiParam;
            }
            return '';
        }
    } catch (e) {
        console.error('%d - registerPayJsSdk function is error,err-msg is:' + e, new Date());
        return '';
    }
}

/**
 * 发送模板消息
 * @param content
 */
module.exports.sendTemplateMsg = function *(content) {
    try {

        var accessToken = yield this.getAccessToken();
        var url = wx_api.apiurl.sendTemplateMsg.format(accessToken);
        var options = {
            url: url,
            method: "post",
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: content
        }
        let result = yield thunkify(wx_api.requesthttp)(options);
        console.info('%d - sendTemplateMsg function send content:' + content + ' result:' + JSON.stringify(result), new Date());
        return result;
    } catch (e) {
        console.error('%d - sendTemplateMsg function is error,err-msg is:' + e, new Date());
        return '';
    }
}

/**
 * 生成支付md5的sign码
 */
var tourl = function (param) {
    var paramStr = "";

    for (var key in param) {
        paramStr += key + "=" + param[key] + "&";
    }
    return paramStr.substr(0, paramStr.length - 1);
}

/**
 * 将json转换成xml
 * @param jsparams
 */
var toxml = function (jsonparams) {
    let _xml = "<xml>";
    for (var key in jsonparams) {
        _xml += "<" + key + ">" + jsonparams[key] + "</" + key + ">";
    }
    _xml += "</xml>";
    return _xml;
}