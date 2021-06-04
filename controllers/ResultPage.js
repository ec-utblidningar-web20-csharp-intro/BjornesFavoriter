const fetch = require('node-fetch');
const date = require('date-and-time');
require('dotenv').config();

const fetchtoken = process.env.fetchToken;

function  test(){
    alert();
}
exports.resultPageGet = (req, res) => {
	const search = req.query.city;
	const city = search.charAt(0).toUpperCase() + search.slice(1);
	if (!city) {
		res.redirect('/');
	}
  else {
		renderInfo(city).then(data => res.render('resultpage', data));
	}
};

async function renderInfo(city){
	let data = await getDataPolisen(city);
	
	let statistic = crimeStatistic(data);
	
	let cc = crimesCount(data);
	
	let code = await nameToCode(city);
	
	let income = await getDataScb(code);
	
	let valResultat = await getDataScbValResultat(code)
	let x = {
			data: data,
			city: city,
			statistic: statistic,
			crimeCount: cc,
			income: income,
			valResultat: valResultat
	}

	return x;
	
}



exports.resultPagePost = (req, res) => {
	res.render('resultpage');
};

async function getStationInfo(city, resultstation) {
    let search = await fetch(
        'https://polisen.se/api/policestations'
    );
    let result = await search.json();

	let id;
	let stations = [];

	for(let i = 0; i < result.length; i++)
	{
		stations.push([result[i].id,result[i].name]);
	}

	for (let i = 0; i < stations.length; i++) {
		if (stations[i][1].includes(city)) {
			id = stations[i][0];
		}
	}

    let searchforstation = await fetch(
        `https://polisen.se/api/policestations/${id}`
    );
    resultstation = await searchforstation.json();
	console.log(resultstation.Url);
	return resultstation;

}

// Omvandla kommunnamn till kommunkoder via API

async function nameToCode(city) {
	let code;
	let search = await fetch(
		`http://goteborghangout.ddns.net:3001/api/${fetchtoken}/kommuner`
	);
	let result = await search.json();

	for (let i = 0; i < result[0].length; i++) {
		if (result[0][i].kommunname == city) {
			code = result[0][i].kommuncode;
		}
	}
	return code;
}

// Hämtar valresultat från kommun för alla partier
let scbSearchVariablesValResultat = {
	"query": [
	  {
		"code": "Region",
		"selection": {
		  "filter": "vs:RegionKommun07+BaraEjAggr",
		  "values": [
			"0114"
		  ]
		}
	  },
	  {
		"code": "ContentsCode",
		"selection": {
		  "filter": "item",
		  "values": [
			"ME0104B6"
		  ]
		}
	  },
	  {
		"code": "Tid",
		"selection": {
		  "filter": "item",
		  "values": [
			"2018"
		  ]
		}
	  }
	],
	"response": {
	  "format": "json"
	}
  }

async function getDataScbValResultat(code) {
	scbSearchVariablesValResultat.query[0].selection.values[0] = code;

	let search = await fetch(
		'http://api.scb.se/OV0104/v1/doris/sv/ssd/START/ME/ME0104/ME0104C/ME0104T3',
		{
			method: 'POST',
			body: JSON.stringify(scbSearchVariablesValResultat),
			headers: { 'Content-Type': 'application/json' },
		}	
	);
	let result = await search.json();
	return result.data;
}

	//arti: obj.key[1], antal: obj.values[0]}

// Hämtar medelinkomst per person i kommun

let scbSearchVariables = {
	query: [
		{ code: 'Region', selection: { filter: 'item', values: ['1485'] } },
		{
			code: 'ContentsCode',
			selection: { filter: 'item', values: ['AM0106B3'] },
		},
		{ code: 'Tid', selection: { filter: 'item', values: ['2020'] } },
		{ code: 'Kon', selection: { filter: 'item', values: ['1+2'] } },
	],
	response: { format: 'json' },
};

async function getDataScb(code) {
	scbSearchVariables.query[0].selection.values[0] = code;

	let search = await fetch(
		'http://api.scb.se/OV0104/v1/doris/sv/ssd/am/AM0106/AM0106A/Kommun17g',
		{
			method: 'POST',
			body: JSON.stringify(scbSearchVariables),
			headers: { 'Content-Type': 'application/json' },
		}
	);
	let result = await search.json();
	let income = result.data[0].values;
	return income[0];
}

// Hämtar data från polisens api, just nu enbart från stad
async function getDataPolisen(query) {
	let search = await fetch(
		`http://goteborghangout.ddns.net:3001/api/${fetchtoken}/crimes/place/${query}`
	);
	let result = await search.json();

	return result;
}

// Fyller arrayer med datum för en viss tidsperiod
function fillArray(scope, dateSetup) {
	if (scope == 'week') {
		let weekArray = [];
		let subtractedDate;
		let formatedDate;

		for (let i = 1; i < 8; i++) {
			subtractedDate = date.addDays(dateSetup, -i);
			formatedDate = date.format(subtractedDate, 'YYYY-MM-DD');
			weekArray.push(formatedDate);
		}

		return weekArray;
	} else if (scope == 'month') {
		let monthArray = [];
		let subtractedDate;
		let formatedDate;

		for (let i = 1; i < 31; i++) {
			subtractedDate = date.addDays(dateSetup, -i);
			formatedDate = date.format(subtractedDate, 'YYYY-MM-DD');
			monthArray.push(formatedDate);
		}

		return monthArray;
	}
}

// Funktion för att räkna hur många brott som sker i en stad per tidsintervall

function crimesCount(data) {
	let timesArray = [];

	// Skapar en array med brottens datum i formatet 'YYYY-MM-DD'
	for (let i = 0; i < data[0].length; i++) {
		let crimeDate = data[0][i].date;
		let newDate = crimeDate.slice(0, 10);
		timesArray.push(newDate);
	}

	// Sätter in alla datum som skall stämmas av med brottens datum ( 1 / 7 / 30 dagar)
	let dateSetup = new Date();
	let todayDate = date.format(dateSetup, 'YYYY-MM-DD');
	let weekDates = fillArray('week', dateSetup);
	let monthDates = fillArray('month', dateSetup);

	// Variabler för att hålla räkning på antal brott
	let day = 0;
	let week = 0;
	let month = 0;

	timesArray.map((d) => {
		if (d === todayDate) {
			day++;
		}
		weekDates.map((w) => {
			if (w == d) {
				week++;
			}
		});
		monthDates.map((m) => {
			if (m == d) {
				month++;
			}
		});
	});

	return {
		day: day,
		week: week,
		month: month,
	};
}

// Funktion för att fylla i hur många brott per kategori och sedan sortera en array med flest brott först

function crimeStatistic(crimes) {
	let crimeTypes = {
		Alkohollagen: 0,
		'Anträffad död': 0,
		'Anträffat gods': 0,
		Arbetsplatsolycka: 0,
		Bedrägeri: 0,
		Bombhot: 0,
		Brand: 0,
		'Brand automatlarm': 0,
		Bråk: 0,
		Detonation: 0,
		'Djur skadat/omhändertaget': 0,
		Ekobrott: 0,
		'Farligt föremål, misstänkt': 0,
		Fjällräddning: 0,
		'Fylleri/LOB': 0,
		Förfalskningsbrott: 0,
		'Försvunnen person': 0,
		Gränskontroll: 0,
		Häleri: 0,
		Inbrott: 0,
		'Inbrott, försök': 0,
		Knivlagen: 0,
		'Kontroll person/fordon': 0,
		'Lagen om hundar och katter': 0,
		'Larm inbrott': 0,
		'Larm överfall': 0,
		Miljöbrott: 0,
		'Missbruk av urkund': 0,
		Misshandel: 0,
		'Misshandel, grov': 0,
		'Mord/dråp': 0,
		'Mord/dråp, försök': 0,
		'Motorfordon, anträffat stulet': 0,
		'Motorfordon, stöld': 0,
		Narkotikabrott: 0,
		Naturkatastrof: 0,
		'Ofog barn/ungdom': 0,
		'Ofredande/förargelse': 0,
		'Olaga frihetsberövande': 0,
		'Olaga hot': 0,
		'Olaga intrång/hemfridsbrott': 0,
		'Olovlig körning': 0,
		Ordningslagen: 0,
		'Polisinsats/kommendering': 0,
		Rattfylleri: 0,
		Rån: 0,
		'Rån väpnat': 0,
		'Rån övrigt': 0,
		'Rån, försök': 0,
		Räddningsinsats: 0,
		Sedlighetsbrott: 0,
		'Sjukdom/olycksfall': 0,
		Sjölagen: 0,
		Skadegörelse: 0,
		Skottlossning: 0,
		'Skottlossning, misstänkt': 0,
		'Spridning smittsamma kemikalier': 0,
		Stöld: 0,
		'Stöld, försök': 0,
		'Stöld, ringa': 0,
		'Stöld/inbrott': 0,
		'Tillfälligt obemannat': 0,
		Trafikbrott: 0,
		Trafikhinder: 0,
		Trafikkontroll: 0,
		Trafikolycka: 0,
		'Trafikolycka, personskada': 0,
		'Trafikolycka, singel': 0,
		'Trafikolycka, smitning från': 0,
		'Trafikolycka, vilt': 0,
		Uppdatering: 0,
		Utlänningslagen: 0,
		Vapenlagen: 0,
		'Varningslarm/haveri': 0,
		'Våld/hot mot tjänsteman': 0,
		Våldtäkt: 0,
		'Våldtäkt, försök': 0,
		'Vållande till kroppsskada': 0,
	};

	for (let i = 0; i < crimes[0].length; i++) {
		for (let key in crimeTypes) {
			if (crimes[0][i].type === key) {
				crimeTypes[key] = crimeTypes[key] + 1;
			}
		}
	}

	const sortedList = Object.entries(crimeTypes)
		.sort(([, a], [, b]) => b - a)
		.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

	return sortedList;
}
