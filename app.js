const express = require('express'),
	app = express();

require('dotenv').config();
app.set('view engine', 'ejs');
app.use('/', require('./routes/mainRoute'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Listening to Port: ${PORT}`);
});
