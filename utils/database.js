const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'commerce'
});
module.exports = pool;