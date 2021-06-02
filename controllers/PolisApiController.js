var express = require('express');
var app = express();

var mysql = require('mysql2');

var con = mysql.createConnection({
	host: 'goteborghangout.ddns.net',
	user: 'test',
	password: `test`,
	database: 'mydb',
});

app.listen(3001, () => {
	console.log('Server running on port 3001');
});

con.connect(function (err) {
	if (err) throw err;
	console.log('Connected!');

	//Tar allt
	var sqlConnect = 'SELECT * FROM crimes';
	con.query(sqlConnect, function (err, result) {
		if (err) throw err;

		app.get('/api/crimes', (req, res, next) => {
			console.log(result);

			res.json([result]);
		});
	});

	//localhost/api/crimes/namnPåStället
	app.get('/api/crimes/place/:place', (req, res) => {
		const place = req.params.place;

		var sqlPlace = 'SELECT * FROM crimes WHERE place = ?';
		con.query(sqlPlace, place, function (err, result) {
			if (err) throw err;
			console.log(result);
			res.json([result]);
		});
	});

	//localhost/api/crimes/typAvBrott
	app.get('/api/crimes/type/:type', (req, res) => {
		const type = req.params.type;

		var sqlType = 'SELECT * FROM crimes WHERE type = ?';
		con.query(sqlType, type, function (err, result) {
			if (err) throw err;
			console.log(result);
			res.json([result]);
		});
	});
});
