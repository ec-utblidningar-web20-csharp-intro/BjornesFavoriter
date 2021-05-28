const fetch = require('node-fetch');

exports.resultPageGet = (req, res) => {
    const city = req.query.city;
    if(!city){
        res.redirect('/');
    } else {        
        getData(city)
        .then(data => res.render('resultpage', {data:data, city:city, statistic: crimeStatistic(data)}));
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

function crimeStatistic (crimes){

    let crimeTypes = {
        'Alkohollagen': 0,
        'Anträffad död': 0,
        'Anträffat gods': 0,
        'Arbetsplatsolycka': 0,
        'Bedrägeri': 0,
        'Bombhot': 0,
        'Brand': 0,
        'Brand automatlarm': 0,
        'Bråk': 0,
        'Detonation': 0,
        'Djur skadat/omhändertaget': 0,
        'Ekobrott': 0,
        'Farligt föremål, misstänkt': 0,
        'Fjällräddning': 0,
        'Fylleri/LOB': 0,
        'Förfalskningsbrott': 0,
        'Försvunnen person': 0,
        'Gränskontroll': 0,
        'Häleri': 0,
        'Inbrott': 0,
        'Inbrott, försök': 0,
        'Knivlagen': 0,
        'Kontroll person/fordon': 0,
        'Lagen om hundar och katter': 0,
        'Larm inbrott': 0,
        'Larm överfall': 0,
        'Miljöbrott': 0,
        'Missbruk av urkund': 0,
        'Misshandel': 0,
        'Misshandel, grov': 0,
        'Mord/dråp': 0,
        'Mord/dråp, försök': 0,
        'Motorfordon, anträffat stulet': 0,
        'Motorfordon, stöld': 0,
        'Narkotikabrott': 0,
        'Naturkatastrof': 0,
        'Ofog barn/ungdom': 0,
        'Ofredande/förargelse': 0,
        'Olaga frihetsberövande': 0,
        'Olaga hot': 0,
        'Olaga intrång/hemfridsbrott': 0,
        'Olovlig körning': 0,
        'Ordningslagen': 0,
        'Polisinsats/kommendering': 0,
        'Rattfylleri': 0,
        'Rån': 0,
        'Rån väpnat': 0,
        'Rån övrigt': 0,
        'Rån, försök': 0,
        'Räddningsinsats': 0,
        'Sedlighetsbrott': 0,
        'Sjukdom/olycksfall': 0,
        'Sjölagen': 0,
        'Skadegörelse': 0,
        'Skottlossning': 0,
        'Skottlossning, misstänkt': 0,
        'Spridning smittsamma kemikalier': 0,
        'Stöld': 0,
        'Stöld, försök': 0,
        'Stöld, ringa': 0,
        'Stöld/inbrott': 0,
        'Tillfälligt obemannat': 0,
        'Trafikbrott': 0,
        'Trafikhinder': 0,
        'Trafikkontroll': 0,
        'Trafikolycka': 0,
        'Trafikolycka, personskada': 0,
        'Trafikolycka, singel': 0,
        'Trafikolycka, smitning från': 0,
        'Trafikolycka, vilt': 0,
        'Uppdatering': 0,
        'Utlänningslagen': 0,
        'Vapenlagen': 0,
        'Varningslarm/haveri': 0,
        'Våld/hot mot tjänsteman': 0,
        'Våldtäkt': 0,
        'Våldtäkt, försök': 0,
        'Vållande till kroppsskada': 0
    };

    for(let i = 0; i < crimes.length; i++){
        for(let key in crimeTypes){
            if(crimes[i].type === key){
                crimeTypes[key] = crimeTypes[key] + 1;
            }
        }
    }

    const sortable = Object.entries(crimeTypes)
    .sort(([,a],[,b]) => b-a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    return sortable;
}

