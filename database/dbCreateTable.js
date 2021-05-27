var mysql = require('mysql2');
require('dotenv').config();
const PASSWORD = process.env.PASSWORD;

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: `${PASSWORD}`,
    database: "mydb"
});

con.connect(function (err) {

    var sql = "DROP TABLE crimes";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table deleted");
    });

    var sql = "CREATE TABLE crimes (id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255), date VARCHAR(255), place VARCHAR(255), description VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table Created");
    });
});