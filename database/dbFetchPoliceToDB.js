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
	if (err) throw err;
	console.log('Connected!');
    var sql = "INSERT INTO crimes(type,date,place,description) VALUES ('misshandel','2021-05-27', 'göteborg', 'svartsjukedrama')";
	con.query(sql, function (err, result){
		if (err) throw err;
		console.log('Database created');
	});
});