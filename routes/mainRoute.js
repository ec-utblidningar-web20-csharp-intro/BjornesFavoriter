const express = require('express'),
	router = express.Router(),
	mainPage = require('../controllers/MainPage');
	resultPage = require('../controllers/ResultPage');

router.get('/', mainPage.mainPage);

router.get('/resultpage', resultPage.resultPageGet);

router.post('/resultpage', resultPage.resultPagePost);

module.exports = router;
