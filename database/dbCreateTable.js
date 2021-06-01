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

    /*var sql = "DROP TABLE crimes";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table deleted");
    });*/

    var table = "SELECT * FROM information_schema.tables WHERE table_schema = 'mydb' AND table_name = 'crimes' LIMIT 1;";
    con.query(table, function (err, result)
    {
        if (result == false)
        {
            var sql = "CREATE TABLE crimes (id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(255), date VARCHAR(255), place VARCHAR(255), description VARCHAR(255))";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("Table Created");
            });
        }
        else{
            console.log("Table already Exists");
        }
    });
});