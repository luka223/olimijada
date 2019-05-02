const express = require('express');

var proveriNavodnike = require('../../config/checkQuotationMarks');
var mail_send = require('../mail_send');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
const checkAuth = require('./check-auth');
var path = require('path');
// Podesavanje CORS-a da prihvata zahteve samo iz frontend aplikacije
var cors = require('cors');
var const_adr = require('../../config/const');

var corsOpcije =
	{
		origin: const_adr.frontend,
		optionsSuccessStatus: 200,
		exposedHeaders: 'Token'
	};

var schedule = require('../schedule');
var mail_send = require("../mail_send");

function getRandomIntInclusive(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
//dodavanje tima za odredjenu igru
router.post('/dodajTim', checkAuth, function (req, res, next) 
{
	var idKorisnika = req.body.idKorisnika;
	var idIgre = req.body.idIgre;
	var naziv = req.body.naziv;
	var nazivNovi = proveriNavodnike.checkQuotationMarks(naziv);

	var sql = `SELECT *
			   FROM Tim
			   WHERE naziv = ?`;

	db.all(sql, [nazivNovi], function (err, rows)
	{
		if (rows.length > 0)
			res.json({ success: true, istiNaziv: true });
		else
		{
			sql = `INSERT INTO Tim(naziv, idKorisnika, idIgre)
		   VALUES (?, ?, ?)`;

			//var sql = "insert into Tim(naziv,idIgre,idKorisnika) VALUES(" + { naziv } + " ," + { idKorisnika } + "," + { idIgre } + ") ";

			db.run(sql, [nazivNovi, idKorisnika, idIgre], function (err) 
			{
				if (err)
					res.json({ success: false });
				else
				{
					// poslednje dodati tim ce imati najveci ID
					var sql2 = `SELECT MAX(ID) AS ID
					    FROM Tim`;

					db.all(sql2, function (err, rows)
					{
						var id = rows[0].ID;
						res.json({ success: true, idDodatogTima: id }); // neophodno da bi se dodali grb i botovi tima
					});
				}
			});
		}
	});


});

router.post('/dodajBota', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var nazivBota = req.body.nazivBota;
	var idIgre = req.body.idIgre;
	var fajl = '';
	var nazivNovi = proveriNavodnike.checkQuotationMarks(nazivBota);

	var sql = `INSERT INTO Bot(naziv, fajl, rankPoeni, idKorisnika, idIgre)
			   VALUES (?, ?, ?, ?, ?)`;

	db.run(sql, [nazivNovi, fajl, 0, idKorisnika, idIgre], function (err)
	{
		if (err)
			res.json({ success: false });
		else
		{
			res.json({ success: true });
		}
	});
});

router.post('/dodajBotoveUTim', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var nizBotova = req.body.nizBotova;

	if (isNaN(idTima) || nizBotova.some(isNaN))
	{
		res.json({ success: false });
		return;
	}

	var vrednosti = "";
	for (let i = 0; i < nizBotova.length; i++)
	{
		vrednosti += "(" + nizBotova[i] + ", " + idTima + " ), ";
	}

	var sql = `INSERT INTO TimBot
			   VALUES ${vrednosti}`;

	sql = sql.slice(0, -2);

	db.run(sql, function (err)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

router.post('/sendCode', function (req, res, next)
{

	var email = req.body.email;

	var sql = `select * from Korisnik where email='${email}'`


	db.all(sql, function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{

			if (rows.length > 0)
			{
				if (rows[0].potvrdjen == 'true')
				{
					var code = getRandomIntInclusive(100000, 999999);
					mail_send.send_mail(email, "Code for password reset", "", `<h1>Your code for password reset: <b>${code}</b></h1>`);
					res.json({ success: true, code: code, id: rows[0].ID });

				}
				else
				{
					res.json({ success: false, msg: "HOMEPAGE.NOT_ACTIVATED" });
				}
			}
			else
			{

				res.json({ success: false, msg: "HOMEPAGE.NO_ACCOUNT" });
			}



		}
	});

});



router.post('/sendMail', function (req, res, next)
{


	var username = req.body.username;

	var sql = `select k.ID as ID ,k.username as username,k.email email,kk.kod as kod,k.jezik as jezik
	from Korisnik k join KorisnickiKodovi kk on k.ID=kk.IdKorisnika
	where username= ?`;



	db.all(sql, [username], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{

			var email = rows[0].email;
			var kode = rows[0].kod;
			var user = { "email": email, "kod": kode, "jezik": rows[0].jezik }

			var srpSUbject = "Potvrda naloga na Olimijadi";
			var engSUbject = "Conffirm account on Olimijada";



			var address = req.body.address + "/validacija?kode=" + kode;

			if (user.jezik == "en")
				mail_send.send_mail(user.email, engSUbject, "", `<div> 
							
				<br>
							<h3>Here you can activate your Olimijada account:<a href='${address}'>Here</a></h3>
						<br>
						<br>
						</div>`);
			else
			{
				mail_send.send_mail(user.email, srpSUbject, "", `<div> 
							
				<br>
							<h3>Ovde možete aktivirati vaš Olimijada nalog:<a href='${address}'>Here</a></h3>
						<br>
						<br>
						</div>`);

			}

			res.json({ success: true, user: user });

		}



	});


});

module.exports = router;