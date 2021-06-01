const express = require('express'),
	app = express();

const { Console } = require('node:console');
var path = require('path');
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use('/', require('./routes/mainRoute'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Listening to Port: ${PORT}`);
});

Console.log('hello');
