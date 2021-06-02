const express = require('express'),
	router = express.Router(),
	mainPage = require('../controllers/MainPage');
	resultPage = require('../controllers/ResultPage');

  aboutPage = require('../controllers/MainPage');

  contactPage = require('../controllers/ContactPage');

  router.get('/', mainPage.mainPage);

  router.get('/contactpage', contactPage.contactPage);

  router.get('/resultpage', resultPage.resultPageGet);

  router.post('/resultpage', resultPage.resultPagePost);

  module.exports = router;
