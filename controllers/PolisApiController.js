var express = require('express');
var app = express();
require('dotenv').config();
var mysql = require('mysql2');
const token = process.env.TOKEN;
const password = process.env.PASSWORD;

var con = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: password,
	database: 'mydb',
});

app.listen(3001, () => {
	console.log('Server running on port 3001');
});

con.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');

	//Tar allt
	//http://goteborghangout.ddns.net:3001/token/api/crimes
	app.get(`/api/${token}/crimes`, (req, res, next) => {

		var sqlConnect = 'SELECT * FROM crimes';
		con.query(sqlConnect, function (err, result) {
			if (err) throw err;
			res.json([result]);
		});
	});

	//http://goteborghangout.ddns.net:3001/api/token/crimes/place/varberg
	app.get(`/api/${token}/crimes/place/:place`, (req, res) => {

		const place = req.params.place;

		var sqlPlace = 'SELECT * FROM crimes WHERE place = ?';
		con.query(sqlPlace, place, function (err, result) {
			if (err) throw err;
			res.json([result]);
		});
	});

	//http://goteborghangout.ddns.net:3001/api/token/crimes/type/trafikolycka
	app.get(`/api/${token}/crimes/type/:type`, (req, res) => {
		const type = req.params.type;

		var sqlType = 'SELECT * FROM crimes WHERE type = ?';
		con.query(sqlType, type, function (err, result) {
			if (err) throw err;
			res.json([result]);
		});
	});

	//http://goteborghangout.ddns.net:3001/api/demotoken/kommuner
	app.get(`/api/${token}/kommuner`, (req, res) => {

		var sqlkommuner = 'SELECT * FROM kommuner';
		con.query(sqlkommuner, function (err, result) {
			if (err) throw err;
			res.json([result]);
		});
	});

	app.get(`/api/${token}/crimes/topplista`, (req, res) => {
		var sql = `(SELECT place, COUNT(*) as count FROM crimes GROUP BY place ORDER BY count DESC)`;
		con.query(sql, function (err, result){
			if (err) throw err;
			res.json([result]);
		});	
	})
})