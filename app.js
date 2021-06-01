const express = require('express'),
	app = express();

var path = require('path');
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use('/', require('./routes/mainRoute'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Listening to Port: ${PORT}`);
});
