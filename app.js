const express = require('express'),
	app = express();

require('dotenv').config();

app.get('/', (Req, res) => {
	res.send('hej hej');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Listening to Port: ${PORT}`);
});
