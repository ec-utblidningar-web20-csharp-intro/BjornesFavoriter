const xlsxFile = require('read-excel-file/node');

var mysql = require('mysql2');
require('dotenv').config();
const PASSWORD = process.env.PASSWORD;

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: `${PASSWORD}`,
    database: "mydb"
});

con.connect(function(err) {
	if (err) throw err;
	console.log('Connected!');

	var table = "SELECT * FROM information_schema.tables WHERE table_schema = 'mydb' AND table_name = 'kommuner' LIMIT 1;";
    con.query(table, function (err, result)
    {
        if (result == false)
        {
			var sqldata = "CREATE TABLE kommuner (id INT AUTO_INCREMENT PRIMARY KEY, kommunname VARCHAR(255), kommuncode VARCHAR(255))";
			con.query(sqldata, function (err, result) {
			if (err) throw err;
			console.log("Table Created");
			});


			xlsxFile('./kommunlankoder.xlsx').then((rows) => {
				rows.forEach((col) => {
		
					var sql = `INSERT INTO kommuner(kommunname, kommuncode) VALUES ('${col[1]}', '${col[0]}')`;
                        con.query(sql, function (err, result){
                            if (err) throw err;
							console.log("records inserted");
                        });
				});
			});
		}
	})
	
})

