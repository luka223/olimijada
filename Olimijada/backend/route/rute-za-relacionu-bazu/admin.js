var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
//var db = require('../config/database'); //dodavanje konekcije sa bazon
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var sha1 = require('sha1');
var jwt = require('jsonwebtoken');
var mail_send = require('../mail_send');
router.use(bodyParser.json());

var proveriNavodnike = require('../../config/checkQuotationMarks');

var const_adr = require("../../config/const");
var checkAuthAdmin = require('./check-auth-admin');
var cors = require('cors');
var corsOpcije =
	{

		origin: const_adr.frontend,
		optionsSuccessStatus: 200,
		exposedHeaders: 'TokenAdmin'
	};


router.post('/proveriToken', checkAuthAdmin, function (req, res, next)
{
	res.end();
});

router.post('/adminSignIn', function (req, res, next)
{
	var username = req.body.user.username;
	var password = req.body.user.password;
	var sql = `select * from Korisnik where username='${username}' and (idTipaKorisnika=1 or idTipaKorisnika=0)`

	db.all(sql, function (err, row)
	{
		if (err)
		{
			res.json({ success: false, msg: "error on database" })
		}
		else
		{
			if (row.length == 0)
			{
				res.json({ success: false, msg: "WRONG_PASSOWRD_OR_USERNAME" })
			}
			else
			{
				if (bcrypt.compareSync(password, row[0].password) != true)
				{
					res.json({ success: false, msg: "WRONG_PASSOWRD_OR_USERNAME" })
				}
				else
				{
					var user = { ID: row[0].ID, username: row[0].username, email: row[0].email, jezik: row[0].jezik, slika: row[0].slika, idTipaKorisnika: row[0].idTipaKorisnika, potvrdjen: row[0].potvrdjen };
					var token = jwt.sign({ user }, "poverljivo", { expiresIn: "1h" });
					res.json({ success: true, msg: "Uspesno logovanje", user: user, token: "Bearer " + token });

				}
			}
		}
	});
});

router.post('/obrisiKorisnika', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var username = req.body.username;
	var sql = `DELETE FROM Korisnik WHERE username = "${username}"`;
	var sqlPokupiKorisnika = `SELECT * FROM Korisnik WHERE username = "${username}"`;

	db.all(sqlPokupiKorisnika, function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			var korisnik = rows[0];
			var naslovEn = "Deleted account";
			var naslovSr = "Obrisan nalog";
			var sadrzajMejlaEn = "<div>Dear "
				+ username
				+ ",<br><br>Your account on Olimijada has been deleted.<br><br>Best regards,<br>Team Inception.</div>";
			var sadrzajMejlaSr = "<div>Poštovni/na "
				+ username
				+ ",<br><br>Vaš nalog na Web sajtu Olimijada je obrisan.<br><br>Pozdrav,<br>Tim Inception.</div>";


			if (korisnik.jezik == "en")
			{
				mail_send.send_mail(korisnik.email, naslovEn, "", sadrzajMejlaEn);
			}
			else
			{
				mail_send.send_mail(korisnik.email, naslovSr, "", sadrzajMejlaSr);
			}

			db.run(sql, function (err)
			{
				if (err)
				{
					res.json({ success: false });
				}
				else
				{
					res.json({ success: true });
				}
			});
		}
	})


});

router.post('/dajAdminPrava', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var username = req.body.username;
	var sql = `UPDATE Korisnik
				SET idTipaKorisnika = 1
				WHERE username = "${username}"`;

	db.run(sql, function (err)
	{
		if (err)
		{
			res.json({ success: false })
		}
		else
		{
			res.json({ success: true });
		}
	})
});

router.post('/vratiSveKorisnike/', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{//za admin stranu
	var sql = `SELECT ID, username, slika, email
			   FROM Korisnik
			   WHERE idTipaKorisnika == 2`;

	db.all(sql, function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, korisnici: rows });
		}
	})
});

router.post('/vratiSveAdministratore/', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var sql = `SELECT ID, username, slika, email
			   FROM Korisnik
			   WHERE idTipaKorisnika == 1`;

	db.all(sql, function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, admini: rows });
		}
	});
});

router.post('/ukloniAdminPrava', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var username = req.body.username;
	var sql = `UPDATE Korisnik
			   SET idTipaKorisnika = 2
			   WHERE username = ?`;

	db.run(sql, [username], function (err)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true });
		}
	})
});

router.post('/posaljiMejlKorisniku/', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var email = req.body.email;
	var naslov = req.body.naslov;
	var sadrzajMejla = req.body.sadrzaj;

	//var email = "marija.janicijevic.5.123@gmail.com";

	var uspesno = mail_send.send_mail(email, naslov, "", sadrzajMejla);

	res.json({ success: true });
});

router.post('/posaljiMejlSviKorisnicima/', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var naslov = req.body.naslov;
	var sadrzajMejla = req.body.sadrzaj;
	var sql = `select email
			   from Korisnik
			   where idTipaKorisnika = 2`;

	db.all(sql, function (err, rows)
	{
		if (err)
		{
			//console.log("greska sa bazom");
		}
		else
		{
			rows.forEach(row =>
			{
				mail_send.send_mail(row.email, naslov, "", sadrzajMejla);
			});
		}
	});

	res.json({ success: true });
});



//dodavanje takmicenja za admin stranu
router.post('/dodajTakmicenje', checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var naziv = req.body.naziv;
	var nazivNovi = proveriNavodnike.checkQuotationMarks(naziv);

	var idTipa = req.body.idTipa;
	var idIgre = req.body.idIgre;
	var brojTimova = req.body.brojTimova;
	var pocetak = req.body.pocetak;
	var kraj = req.body.kraj;
	var minRang = req.body.minRang;
	var maxRang = req.body.maxRang;

	var sql = `INSERT INTO Takmicenje(naziv, minBrojIgraca, maxBrojIgraca,datumPocetka, datumZavrsetka, idTipaTakmicenja, idIgre, minRang, maxRang)
			   VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?)`;

	db.run(sql, [nazivNovi, 1, brojTimova, pocetak, kraj, idTipa, idIgre, minRang, maxRang], function (err)
	{
		if (err)
			res.json({ success: false });
		else
		{
			sql = 'SELECT MAX(ID) AS idTakmicenja FROM Takmicenje';
			db.all(sql, function (err, rows)
			{
				if (err)
					res.json({ success: false });
				else
				{
					var idTakmicenja = rows[0].idTakmicenja;

					sql = `SELECT *
					       FROM Prijavljeni
					       WHERE idTakmicenja = ?`;

					db.all(sql, [idTakmicenja], function (err, rows)
					{
						if (err)
							res.json({ success: false });
						else
						{
							if (idTipa == 1)
							{
								// liga
								schedule.formirajMeceveLige(idTakmicenja, pocetak, rows);
							}
							else
							{
								// turnir
							}

							res.json({ success: true });
						}


					});
				}
			});
			var sql = `SELECT * FROM`;
			if (idTipa == 1)
			{
				// liga
				schedule.formirajMeceveLige()
			}

		}
	});
});

router.post('/dodajIgru', cors(corsOpcije), checkAuthAdmin, function (req, res, next)
{
	var naziv = req.body.naziv;
	var nazivNovi = proveriNavodnike.checkQuotationMarks(naziv);
	var minBrojTimova = req.body.minBrojTimova;
	var maxBrojTimova = req.body.maxBrojTimova;
	var opis = req.body.opis;
	opis = proveriNavodnike.checkQuotationMarks(opis);
	var description = req.body.description;
	description = proveriNavodnike.checkQuotationMarks(description);
	var minBrojIgraca = req.body.minBrojIgraca;
	var maxBrojIgraca = req.body.maxBrojIgraca;
	var slika = 'uploads/slikeIgara/placeholder.jpg';
	// var slika1 = 'uploads/ikoneIgara/placeholder.jpg';
	// var slika2 = 'uploads/tereniIgara/placeholder.jpg';

	var sql = `INSERT INTO Igra(naziv,minBrojTimovaUMecu,maxBrojTimovaUMecu,opis,description,slika,ikona, pozadina,minBrojIgracaUTimu,maxBrojIgracaUTimu)
			   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

	var sqlIzvuciIdIgre = `select ID from Igra where naziv = ?`;
	db.run(sql, [nazivNovi, minBrojTimova, maxBrojTimova, opis, description, slika, slika, slika, minBrojIgraca, maxBrojIgraca], function (err)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			db.all(sqlIzvuciIdIgre, [naziv], function (err, rows)
			{
				if (err)
				{
					res.json({ success: false });
				}
				else
				{
					res.json({ success: true, id: rows[0].ID });
				}
			})
			//res.json({ success: true });
		}
	});
});

router.get('/vratiMaxIDIgre', cors(corsOpcije), function (req, res, next) 
{
	var sql = `select * from igra order by ID desc limit 1`

	db.all(sql, function (err, rows)
	{
		res.json(rows);
	});
});

router.post("/obrisiIgru", checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	var idIgre = req.body.idIgre;
	var sql = `DELETE FROM Igra
			   WHERE ID = ?`;

	db.run(sql, [idIgre], function (err)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

router.post("/azurirajIgru", checkAuthAdmin, cors(corsOpcije), function (req, res, next)
{
	// u body-ju je cela igra
	var igra = req.body.igra;
	//console.log(igra);
	
	var sql = `UPDATE Igra
			   SET naziv = ?, minBrojTimovaUMecu = ?, maxBrojTimovaUMecu = ?, opis = ?, description = ?, minBrojIgracaUTimu = ?, maxBrojIgracaUTimu = ?
			   WHERE ID = ?`;

	db.run(sql, [igra.naziv, igra.minBrojTimovaUMecu, igra.maxBrojTimovaUMecu, igra.opis, igra.description, igra.minBrojIgracaUTimu, igra.maxBrojIgracaUTimu, igra.ID], function (err)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

module.exports = router;