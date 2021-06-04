const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

require('dotenv').config();

const fetchtoken = process.env.fetchToken;

exports.mailSender = (req, res) => {
	const type = req.query.type;
	const date = req.query.date;
	const place = req.query.place;
	const description = req.query.description;
	const mail = req.query.email;
	
	sendMail(type, date, place, description, mail);
	res.redirect(`/resultpage?city=${place}`);
};

function sendMail(type, date, place, description, mail){

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: 'agilecocrime@gmail.com',
		  pass: 'ecocrime'
		}
	  });
	  
	const mailOptions = {
		from: 'agilecocrime@gmail.com',
		to: '',
		subject: 'Du har fått ett delat brott',
		text: 'That was easy!'
	  };

	mailOptions.to = mail;
	mailOptions.text = 
	`Typ av brott: ${type},
	 Datum: ${date},
	 Plats: ${place},
	 Beskrivning: ${description}`;
	  
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });

};
