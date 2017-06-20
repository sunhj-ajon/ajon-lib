/**
 * Created by admin on 2016-11-10.
 */

var request = require("request");

var api = module.exports = function () {

}

api.prototype.apiurl = {
    getOpenidByCode: "https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type=authorization_code".format(conf.wechat.appid, conf.wechat.appsecret),
    getAccessToken: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={0}&secret={1}".format(conf.wechat.appid, conf.wechat.appsecret),
    getUserInfo: "https://api.weixin.qq.com/cgi-bin/user/info?access_token={0}&openid={1}&lang=zh_CN",
    getjssdkticket: "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={0}&type=jsapi",
    sendTemplateMsg: "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={0}",
    getUserList: "https://api.weixin.qq.com/cgi-bin/user/get?access_token={0}&next_openid={1}"
}

/**
 * http request
 * @param options
 *   {
        url:"https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+token+"&type=jsapi" ,
        method:"get",
        headers:{'content-type':'application/x-www-form-urlencoded'},
        body:""
      }
 * @param callback
 */
api.prototype.requesthttp = function (options, callback) {
    request(options, function (e, r, body) {
        if (!e) {
            try {
                if (body.indexOf('xml') != -1) {
                    e = null;
                } else {
                    body = JSON.parse(body);
                    if (body.errcode) {
                        e = null;
                    }
                }
            }
            catch (error) {
                e = error;
            }
        }
        callback && callback(e, body);
    });
}