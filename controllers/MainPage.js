const fetch = require("node-fetch");
require('dotenv').config();
const token = process.env.fetchtoken;


exports.mainPage = (req, res) => {
	let data;
	fetchTopplista(data).then((data) =>
	res.render('../views/mainPage.ejs',{
		data : data,
	})
	)
};

async function fetchTopplista(){
	let resp = await fetch(`http://goteborghangout.ddns.net:3001/api/${token}/crimes/topplista`);
	let data = await resp.json();
	console.log(data);
	return data;
}

exports.contactPage = (req, res) => {
	res.render('../views/contactPage.ejs');
};

exports.aboutPage = (req, res) => {
	res.render('../views/aboutPage.ejs');
};

exports.faqPage = (req, res) => {
	res.render('../views/faqPage.ejs');
};
