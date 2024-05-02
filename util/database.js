const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    database: 'node-proj',
    password: 'welcome123'
});


module.exports = pool.promise();