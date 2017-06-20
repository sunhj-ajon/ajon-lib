/**
 * Created by admin on 2016-11-10.
 */

var crypto = require('crypto');


module.exports = {
    /**
     * sha1加密
     * @param str
     * @returns {string}
     */
    sha1: function (str) {
        var md5sum = crypto.createHash('sha1');
        md5sum.update(str, 'utf-8');
        str = md5sum.digest('hex');
        return str;
    },
    md5: function (str) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    },
    _md5: function (data) {
        var Buffer = require("buffer").Buffer;
        var buf = new Buffer(data);
        var str = buf.toString("binary");
        var crypto = require("crypto");
        return crypto.createHash("md5").update(str).digest("hex");
    },
    cipher: function (algorithm, key, data) {
        var encrypted = "";
        var cip = crypto.createCipher(algorithm, key);
        encrypted += cip.update(data, 'binary', 'hex');
        encrypted += cip.final('hex');
        return encrypted;
    },
    decipher: function (algorithm, key, data) {
        var decrypted = "";
        var decipher = crypto.createDecipher(algorithm, key);
        decrypted += decipher.update(data, 'hex', 'binary');
        decrypted += decipher.final('binary');
        return decrypted;
    }

}


