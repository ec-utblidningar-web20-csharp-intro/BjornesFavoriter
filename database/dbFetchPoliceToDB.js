var mysql = require('mysql2');
const fetch = require("node-fetch");
require('dotenv').config();
const PASSWORD = process.env.PASSWORD;

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: `${PASSWORD}`,
    database: "mydb"
});

fetchCrimes();

async function fetchCrimes(){
    let res = await fetch('https://polisen.se/api/events')
    let data = await res.json();

    con.connect(function (err) {
        if (err) throw err;
        console.log('Connected!');

            for (let i = 0; i < data.length; i++) {

                con.query(`SELECT * FROM crimes WHERE description = '${data[i].summary}' AND date = '${data[i].datetime}' AND type = '${data[i].type}' AND place = '${data[i].location.name}' LIMIT 1;`, function (err, result) {
                    console.log(result);
                    if(result == false)
                    {
                        var sql = `INSERT INTO crimes(type, date, place, description) VALUES ('${data[i].type}', '${data[i].datetime}', '${data[i].location.name}', '${data[i].summary}')`;
                        con.query(sql, function (err, result){
                            if (err) throw err;
                        });
                    }
                });
        }
    });
}

