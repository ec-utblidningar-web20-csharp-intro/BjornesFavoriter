const fetch = require('node-fetch');

exports.resultPageGet = (req, res) => {
    const city = req.query.city;
    if(!city){
        res.redirect('/');
    } else {
        const result = getData(city).then(data => console.log(data));
        res.render('resultpage');
	    console.log(result);
    } 
};

exports.resultPagePost = (req, res) => {
    res.render('resultpage');
};

async function getData (query)  {
    let search = await fetch(`https://polisen.se/api/events?locationname=${query}`);
    let result = await search.json();
    return result;
}

