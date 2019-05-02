var express = require('express');
var app = express();


var pozicijeBota = require('./pozicijeBotaCollection');
app.post('/dodajPozicijeBota', function (req, res, next)
{
	var pom = new pozicijeBota(req.body);
	pozicijeBota.dodajPozicijeBota(pom, function (err, data)
	{
		if (err){}
		else
		{
			res.json(data);
		}
	});
});


app.post('/dajPozicijeBotova/:idUtakmice', function (req, res, next)
{
	idUtakmice = req.params.idUtakmice;
	

	pozicijeBota.dajPozicijeBotaUmecu(idUtakmice, function (err, data)
	{
		if (err){}
		else
		{
			
			res.json(data);
		}
	});
});

module.exports = app;