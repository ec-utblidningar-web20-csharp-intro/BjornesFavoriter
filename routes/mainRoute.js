const express = require('express'),
	router = express.Router(),
	mainPage = require('../controllers/MainPage');
resultPage = require('../controllers/ResultPage');
contactPage = require('../controllers/MainPage');
aboutPage = require('../controllers/MainPage');
faqPage = require('../controllers/MainPage');
mailSender = require('../controllers/MailSender');

router.get('/', mainPage.mainPage);
router.get('/contactPage', contactPage.contactPage);
router.get('/aboutPage', aboutPage.aboutPage);
router.get('/faqPage', faqPage.faqPage);

router.get('/resultpage', resultPage.resultPageGet);
router.post('/resultpage', resultPage.resultPagePost);

router.get('/mailsender', mailSender.mailSender);

module.exports = router;
