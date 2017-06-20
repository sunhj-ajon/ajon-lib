/**
 * Created by admin on 2016-09-26.
 */

'use strict';

let _redis = require("redis");

module.exports = function () {
    return {
        init: function () {
            let redis = _redis.createClient(conf.redis);
            redis.on("error", function (err) {
                console.error('%d - redis connect fail' + err, new Date());
            })

            redis.on("connect", function (r) {
                global.redis = redis;
                console.info('%d - redis connect success', new Date());
            })
        },
        // _subscribe: function () {
        //     let __redis = _redis.createClient(conf.redis);
        //     __redis.on("error", function (err) {
        //         console.error('%d - redis connect fail' + err, new Date());
        //     })
        //
        //     __redis.on("connect", function (r) {
        //         global.s_redis = __redis;
        //         console.info('%d - redis connect success', new Date());
        //     })
        //
        //     __redis.on("message", function (err, msg) {
        //         if (msg) {
        //             console.log(_res[0]._body);
        //             //_res[0]._body.body = JSON.parse(msg);
        //             // _res.forEach(function (item) {
        //             //     if (item.id == "1") {
        //             //         //console.log(item.body);
        //             //         item._body.body = JSON.parse(msg);
        //             //     }
        //             // })
        //             //console.log(JSON.parse(msg));
        //         }
        //     })
        // },

        /**
         * 向redis中插入值
         * @param key     键
         * @param value   值
         * @param expire  过期时间
         */
        set: function (key, value, expire, callback) {
            redis.set(key, value, function (err) {
                if (!err) {
                    redis.expire(key, expire);
                    callback(false, true);
                }
                callback(true);
            });
        },

        /**
         * 根据键获取值
         * @param key
         */
        get: function (key, callback) {
            redis.get(key, function (err, result) {
                if (!err) {
                    callback(false, result);
                } else {
                    callback(true);
                }
            })
        }

        // /**
        //  * 发布消息
        //  * @param key
        //  * @param value
        //  * @param callback
        //  */
        // publish: function (key, value, callback) {
        //     redis.publish(key, value);
        //     callback(false);
        // },
        //
        // /**
        //  * 订阅消息
        //  * @param key
        //  * @param callback
        //  */
        // subscribe: function (key) {
        //     s_redis.subscribe(key, function (err, value) {
        //         console.log('starting subscribe channel is -- ' + value);
        //     });
        // }
    }
}();