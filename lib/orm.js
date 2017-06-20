/**
 * Created by admin on 2016-09-27.
 */

'use strict';

global.orm = require("orm");

module.exports = function () {
    return {
        /**
         * 链接数据库
         * @param defineModule  定义的module
         * @param callback      回调函数
         */
        connect: function (callback) {
            orm.connect(conf.orm, function (err, db) {
                if (!err) {
                    console.log('%d - mysql connect success', new Date());
                    global.orm_db = db;
                    global.orm = orm;
                    callback(false);
                } else {
                    console.log('%d - mysql is connect fail', new Date());
                    callback(true);
                }
            })
        }
    }
}();

