const xlsxFile = require('read-excel-file/node');

xlsxFile('./kommunlankoder.xlsx').then((rows) => {
	rows.forEach((col) => {
		col.forEach((data) => {
			console.log(data);
		});
	});
});
