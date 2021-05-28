const fetch = require('node-fetch');

exports.resultPageGet = (req, res) => {
    const city = req.query.city;
    if(!city){
        res.redirect('/');
    } else {
        getData(city).then(data => res.render('resultpage', {data:data, city:city}));
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

