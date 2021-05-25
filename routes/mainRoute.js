const express = require('express'),
	router = express.Router(),
	mainPage = require('../controllers/MainPage');

router.get('/', mainPage.mainPage);

module.exports = router;
