var mysql = require('mysql2');
require('dotenv').config();
const PASSWORD = process.env.PASSWORD;

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: `${PASSWORD}`,
});

con.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');
	con.query('CREATE DATABASE mydb', function (err, result) {
		if (err) throw err;
		console.log('Database created');
	});
});
