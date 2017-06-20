/**
 * Created by Administrator on 2016/12/14.
 */

var mysql      = require('mysql');
var connection = mysql.createConnection({
    database: "squarelife",
    protocol: "mysql",
    host: "118.178.224.171",
    user: "sunhj",
    password: "Squarelife123!@#",
    query: {pool: true, debug: false},
    charset:'utf8mb4'
});


connection.connect();

connection.query("INSERT INTO `d` (`as`) VALUES ( '😱')", function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows);
});

connection.end();