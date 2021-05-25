const express = require('express'),
	app = express();

require('dotenv').config();

app.use('/', require('./routes/hello'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Listening to Port: ${PORT}`);
});
