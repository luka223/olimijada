var mongo = require('../config/mongo');
var express = require('express');
var router = express.Router();
var schedule = require('./schedule');

var checkAuth = require('./rute-za-relacionu-bazu/check-auth');
var checkAuthAdmin = require('./rute-za-relacionu-bazu/check-auth-admin');
var checkAuthUserOrAdmin = require("./rute-za-relacionu-bazu/check-admin-or-user");

var turniriSchema = mongo.Schema({
	naziv: { type: String, required: true },
	maxBrojIgraca: { type: Number, required: true },
	datumPocetka: { type: Date, required: true },
	zavrsen: { type: Boolean, required: true, default: false },
	tipTurnira: { type: Number, required: true },
	idIgre: { type: Number, required: true },
	nazivIgre: { type: String, required: true },
	minRang: { type: Number, required: true },
	maxRang: { type: Number, required: true },
	ucesnici: [{
		idTima: Number,
		nazivTima: String,
		idKorisnika: Number,
		username: String
	}],
	kolo: [{
		brojKola: Number,
		mecevi: [{
			idTima1: Number,
			idTima2: Number,
			poeniTima1: Number,
			poeniTima2: Number,
			pocetakMeca: Date,
			zavrsen: Boolean
		}]
	}]
});

const Turnir = mongo.model('turnir', turniriSchema);

// u body-ju poslati turnir
router.post('/dodajTurnir', checkAuthAdmin, function (req, res, next)
{
	var turnir = new Turnir(req.body);

	turnir.save(function (err, data)
	{
		if (err || data.length == 0)
		{
			res.json({ success: false });
		}
		else
		{
			if (turnir.tipTurnira == 1)
				schedule.funkcije.formirajMeceveLige(data._id, data.naziv, data.datumPocetka);
			else
				schedule.funkcije.formirajMeceveKupa(data._id, data.naziv, data.datumPocetka);

			res.json({ success: true, data: data });
		}
	});
});

router.post('/vratiTurnir', function (req, res, next)
{
	var idTurnira = req.body.idTurnira;

	mongo.model('turnirs', turniriSchema).findOne(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
				res.json({ success: true, turnir: data });
		}
	)
});

router.post('/vratiMeceveKorisnika', function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;

	mongo.model('turnirs', turniriSchema).find(
		{},

		function (err, data)
		{
			if (err || data == undefined || data.length == 0)
				res.json({ success: false });
			else
			{
				var idTima;
				var meceviKorisnika = [];
				for (let i = 0; i < data.length; i++)
				{
					var prijavljenJe = false;
					for (let m = 0; m < data[i].ucesnici.length; m++)
					{
						//	console.log(data[i].ucesnici[m].idKorisnika);
						if (data[i].ucesnici[m].idKorisnika == idKorisnika) 
						{
							prijavljenJe = true;
							idTima = data[i].ucesnici[m].idTima
							break;
						}
					}
					if (prijavljenJe == true)
					{
						for (let j = 0; j < data[i].kolo.length; j++)
						{
							for (let k = 0; k < data[i].kolo[j].mecevi.length; k++)
							{
								if (data[i].kolo[j].mecevi[k].idTima1 == idTima || data[i].kolo[j].mecevi[k].idTima2 == idTima)
								{
									meceviKorisnika.push(data[i].kolo[j].mecevi[k]);
								}
							}

						}
					}
				}
				res.json({ meceviKorisnika: meceviKorisnika, success: true });
			}

		}
	)
});


router.post('/vratiTurnireIgre', function (req, res, next)
{
	var idIgre = req.body.idIgre;

	mongo.model('turnirs', turniriSchema).find(
		{},
		function (err, data)
		{
			var turniri = data;
			var turniriIgre = [];

			turniri.forEach(turnir =>
			{
				var status;
				if (turnir.zavrsen == true)
					status = "GAME_PAGE.TOURNAMENT.FINISHED";
				else if (turnir.datumPocetka.getTime() > (new Date()).getTime())
					status = "GAME_PAGE.TOURNAMENT.ANNOUNCED";
				else
					status = "GAME_PAGE.TOURNAMENT.IN_PROGRESS";

				if (turnir.idIgre == idIgre)
					turniriIgre.push({ ID: turnir._id, naziv: turnir.naziv, status: status, datumPocetka: turnir.datumPocetka });
			});

			res.json({ success: true, turniri: turniriIgre.sort(function (a, b) { return a.datumPocetka.getTime() - b.datumPocetka.getTime(); }).slice(0, 10) });
		}
	)
});

// poslednjih 10 meceva na strani igre
router.post('/vratiPoslednjeUtakmice', function (req, res, next)
{
	var idIgre = req.body.idIgre;

	mongo.model('turnirs', turniriSchema).find(
		{ "idIgre": idIgre },
		function (err, data)
		{
			if (err)
				res.json({ success: false });
			else
			{
				var turniri = data;
				var mecevi = [];

				turniri.forEach(turnir =>
				{
					var kola = turnir.kolo;
					(kola).forEach(kolo =>
					{
						(kolo.mecevi).forEach(mec =>
						{
							mecevi.push(mec);
						});

					});
				});

				if (mecevi.length == 0)
					res.json({ success: true, mecevi: [] });
				else
					res.json({ success: true, mecevi: mecevi.sort(function (a, b) { return a.pocetakMeca.getTime() - b.pocetakMeca.getTime(); }).slice(0, 10) });
			}
		}
	)
});

router.post('/vratiTurnireUNajavi', function (req, res, next)
{
	mongo.model('turnirs', turniriSchema).find(
		{ datumPocetka: { $gt: new Date() } },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
				res.json({ success: true, turniri: data });

		}
	)
});

router.post('/prijaviTimNaTurnir', checkAuth, function (req, res, next)
{
	var idTurnira = req.body.idTurnira;
	var idTima = req.body.idTima;
	var idKorisnika = req.body.idKorisnika;
	var username = req.body.username;
	var nazivTima = req.body.nazivTima;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else if (data[0].datumPocetka < Date())
				res.json({ success: true, prijaveUToku: false });
			else if (data.ucesnici && data.ucesnici.length == data.maxBrojIgraca)
				res.json({ success: true, nemaMesta: true });
			else
			{
				var ucesnici = data[0].ucesnici;
				var prijavljen = ucesnici.find(x => x.idKorisnika == idKorisnika);
				if (prijavljen == undefined)
					ucesnici.push({ idTima: idTima, idKorisnika: idKorisnika, username: username, nazivTima: nazivTima });
				else
				{
					prijavljen.idTima = idTima;
					prijavljen.username = username;
					prijavljen.idKorisnika = idKorisnika;
					prijavljen.nazivTima = nazivTima;
				}

				mongo.model('turnirs', turniriSchema).findByIdAndUpdate(
					{ _id: idTurnira },
					{ $set: { "ucesnici": ucesnici } },
					function (err, data)
					{
						if (err)
							res.json({ success: false });
						else
							res.json({ success: true });
					}
				)
			}
		}
	)
});

router.post('/vratiPrijavljenTimKorisnika', checkAuth, function (req, res, next)
{
	var idTurnira = req.body.idTurnira;
	var idKorisnika = req.body.idKorisnika;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else if (data[0].datumPocetka < Date())
				res.json({ success: true, prijaveUToku: false });
			else
			{
				var ucesnici = data[0].ucesnici;
				var tim = ucesnici.find(x => x.idKorisnika == idKorisnika);
				if (tim == undefined)
					res.json({ success: true, vecPostoji: false });
				else
					res.json({ success: true, vecPostoji: true, tim: { ID: tim.idTima, naziv: tim.nazivTima } });
			}
		}
	)
});

router.post('/vratiZavrseneMeceveTurnira', function (req, res, next)
{
	var idTurnira = req.body.idTurnira;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
			{
				var mecevi = [];

				for (var i = 0; i < data[0].kolo.length; i++)
				{
					var kolo = data[0].kolo[i];
					mecevi.push(kolo.mecevi.filter(x => x.zavrsen == true));
				}

				res.json({ success: true, mecevi: mecevi });
			}
		}
	)
});

router.post('/vratiKoloTurnira', function (req, res, next)
{
	var idTurnira = req.body.idTurnira;
	var brojKola = req.body.brojKola;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
				res.json({ success: true, kolo: data[0].kolo.find(x => x.brojKola == brojKola) });
		}
	)
});

router.post('/spisakPrijavljenihTimova', function (req, res, next)
{
	var idTurnira = req.body.idTurnira;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
				res.json({ success: true, prijavljeni: data[0].ucesnici });
		}
	)
});

router.post('/vratiMec', function (req, res, next)
{
	var idMeca = req.body.idMeca;

	mongo.model('turnirs', turniriSchema).find({}, function (err, data)
	{
		if (err || data.length == 0)
			res.json({ success: false });
		else
		{
			var turniri = data;

			turniri.forEach(turnir =>
			{
				var kola = turnir.kolo;

				kola.forEach(kolo =>
				{
					var mec = kolo.mecevi.find(x => x._id == idMeca);
					if (mec != undefined)
					{
						var nazivTima1 = turnir.ucesnici.find(x => x.idTima1 == mec.idTima1);
						var nazivTima2 = turnir.ucesnici.find(x => x.idTima2 == mec.idTima2);

						res.json({ success: true, idIgre: turnir.idIgre, mec: mec, nazivTima1: nazivTima1, nazivTima2: nazivTima2 });
						res.end();
					}
				});
			});

			// ako se ne nadje nijedan mec
			//res.json({ success: false });
		}

	});


});

router.post('/vratiMeceveUTokuTurnira', function (req, res, next)
{
	var idTurnira = req.body.idTurnira;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
			{
				var mecevi = [];
				var kola = data[0].kolo;

				for (var i = 0; i < kola.length; i++)
					mecevi.push(kola[i].mecevi.filter(x => x.zavrsen == false));

				res.json({ success: true, mecevi: mecevi });
			}
		}
	)
});

router.post('/vratiTimoveIKorisnikeNaTurniru', function (req, res, next)
{
	var idTurnira = req.body.idTurnira;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
				res.json({ success: true, ucesnici: data.ucesnici });
		}
	)
});

router.post('/vratiTurnireNaKojeSuPrijavljeniTimoviKorisnika', checkAuthUserOrAdmin, function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;

	mongo.model('turnirs', turniriSchema).find({}, function (err, data)
	{
		if (err || data.length == 0)
			res.json({ success: false });

		var turniri = data;
		var turniriKorisnika = [];
		(turniri).forEach(turnir =>
		{
			var tim = turnir.ucesnici.find(x => x.idKorisnika == idKorisnika);

			if (tim != undefined)
				turniriKorisnika.push({ naziv: turnir.naziv, datumPocetka: turnir.datumPocetka, tim: tim });
		});

		var turniriKorisnika = [];
		(turniri).forEach(turnir =>
		{
			var tim = turnir.ucesnici.find(x => x.idKorisnika == idKorisnika);

			if (tim != undefined)
				turniriKorisnika.push({ ID: turnir._id, naziv: turnir.naziv, datumPocetka: turnir.datumPocetka, zavrsen: turnir.zavrsen, tim: tim });
		});

		res.json({ success: true, turniri: turniriKorisnika });
	});

});

router.post('/proveriDaLiJosUvekMozeDaSePrijaviNaTurnir', checkAuth, function (req, res, next)
{
	var idTurnira = req.body.idTurnira;

	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err || data.length == 0)
				res.json({ success: false });
			else
			{
				if (data[0].ucesnici.length == data[0].maxBrojIgraca)
					res.json({ success: true, popunjenePrijave: true });
				else
					res.json({ success: true, popunjenePrijave: false });
			}
		}
	)
});

router.post("/obrisiTurnir", checkAuthAdmin, function (req, res, next)
{
	var idTurnira = req.body.idTurnira;
	
	mongo.model('turnirs', turniriSchema).findOneAndRemove(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err)
				res.json({ success: false });
			else
				res.json({ success: true });
		}
	)
});

// meceve slati u odgovarajucem obliku!
function dodajKolo(idTurnira, kolo, mecevi)
{
	mongo.model('turnirs', turniriSchema).findByIdAndUpdate(
		{ _id: idTurnira },
		{ $push: { "kolo": { "brojKola": kolo, "mecevi": mecevi } } },
		{ new: true },
		function (err, data)
		{
			if (err) { }
			//console.log("GRESKA: " + err);
		}
	);
}

function azurirajRezultat(idTurnira, brojKola, idTima1, idTima2, poeniTima1, poeniTima2)
{
	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err) { }
			//console.log("Greska u query-ju");
			else
			{
				var mecevi = data[0].kolo.find(x => x.brojKola == brojKola).mecevi;

				var mec = mecevi.find(x => x.idTima1 == idTima1 && x.idTima2 == idTima2);
				mec.poeniTima1 = poeniTima1;
				mec.poeniTima2 = poeniTima2;
				mec.zavrsen = true;

				mongo.model('turnirs', turniriSchema).updateOne(
					{ _id: idTurnira, "kolo": { $elemMatch: { "brojKola": brojKola } } },
					{ $set: { "kolo.$.mecevi": mecevi } },
					function (err, data)
					{
						if (err) { }
						//console.log("Greska pri azuriranju rezultata");
					}
				)
			}
		}
	)
}

function obrisiTurnir(idTurnira)
{
	mongo.model('turnirs', turniriSchema).findOneAndRemove(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err) { }
			//console.log("Greska pri brisanju turnira");
		}
	)
}

function zatvoriTurnirIVratiPobednika(idTurnira, callback)
{
	mongo.model('turnirs', turniriSchema).findByIdAndUpdate(
		{ _id: idTurnira },
		{ "zavrsen": true },
		function (err, data)
		{
			if (err)
				callback(-1, -1);
			else
			{
				var turnir = data;//[0];

				if (turnir.tipTurnira == 1)
				{
					var timovi = [];
					for (i = 0; i < turnir.ucesnici.length; i++)
						timovi.push({ idTima: turnir.ucesnici[i].idTima, poeni: 0 });

					turnir.kolo.forEach(kolo =>
					{
						var mecevi = kolo.mecevi;
						mecevi.forEach(mec =>
						{
							if (mec.poeniTima1 > mec.poeniTima2)
								timovi.find(x => x.idTima == mec.idTima1).poeni += 3;
							else if (mec.poeniTima1 < mec.poeniTima2)
								timovi.find(x => x.idTima == mec.idTima2).poeni += 3;
							else
							{
								timovi.find(x => x.idTima == mec.idTima1).poeni += 1;
								timovi.find(x => x.idTima == mec.idTima2).poeni += 1;
							}
						});
					});

					var max = { idTima: timovi[0].idTima, poeni: timovi[0].poeni };
					for (let i = 1; i < timovi.length; i++)
						if (max.poeni < timovi[i].poeni)
							max = timovi[i];

					callback(turnir.ucesnici.find(x => x.idTima == max.idTima), data.kolo.length);
				}
				else
				{
					var poslednjeKolo = turnir.kolo.find(x => x.brojKola == 1);
					var mec = poslednjeKolo.mecevi[0];

					if (mec.poeniTima1 > mec.poeniTima2)
						callback(turnir.ucesnici.find(x => x.idTima == mec.idTima1), data.kolo.length);
					else
						callback(turnir.ucesnici.find(x => x.idTima == mec.idTima2), data.kolo.length);
				}
			}
		}
	)
}

function vratiPrijavljeneTimove(idTurnira, callback)
{
	mongo.model('turnirs', turniriSchema).find(
		{ _id: idTurnira },
		function (err, data)
		{
			if (err)
				callback([]);
			else
			{
				callback(data[0].ucesnici); // funkcija koja daje prijavljenje ucesnike u schedule.js
			}

		}
	)
}

module.exports.router = router;
module.exports.funkcije = {
	dodajKolo: dodajKolo,
	azurirajRezultat: azurirajRezultat,
	obrisiTurnir: obrisiTurnir,
	zatvoriTurnirIVratiPobednika: zatvoriTurnirIVratiPobednika,
	vratiPrijavljeneTimove: vratiPrijavljeneTimove
}