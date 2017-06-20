'use strict';

/**
 * Created by admin on 2016-09-23.
 */

const route = require('koa-router');

global.router = new route();

module.exports = function () {
    return {

        /**
         * 加载路由(根据model动态生成路由)
         */
        loadRouteModle: function () {

        },

        loadRoute: function (app) {
            restraints(app);
            app.use(router.routes()).use(router.allowedMethods());
        }
    };
}();

/**
 * 路由限制
 * @param app
 */
function restraints(app) {
    app.use(function *(next) {
        let _url = this.request.url;
        if (_url && _url.split('/')[1] && _url.split('/')[1] === 'openapi') {
            let token = this.request.query.token;
            if (!token) {
                this.body = msg.msgResult(msg.code.token_invalid, {});
            } else {
                yield next;
            }
        } else {
            yield next;
        }
    })
}