const express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
const checkAuth = require('./check-auth');
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcrypt');
// Podesavanje CORS-a da prihvata zahteve samo iz frontend aplikacije
var cors = require('cors');

var const_adr = require("../../config/const");
var corsOpcije =
	{

		origin: const_adr.frontend,
		optionsSuccessStatus: 200,
		exposedHeaders: 'Token'
	};

// azuriranje korisnickog imena korisnika na osnovu podatka unetog na profilnoj strani
router.post('/azurirajMejl/', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika; // ovo treba ukloniti nakon dodavanja sesija u Node, posto cemo tada znati ko je ulogovan
	var email = req.body.email;

	var sql = `UPDATE Korisnik 
			   SET email = '?
			   WHERE ID = ?`;

	db.run(sql, [email, idKorisnika], function (err)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

// azuriranje svih podataka korisnika (username, password) na osnovu podataka unetih na profilnoj strani
// u body-ju se salju podaci
router.post('/azurirajSvePodatke/', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika; // ovo treba ukloniti nakon dodavanja sesija u Node, posto cemo tada znati ko je ulogovan
	var trenutniPass = req.body.trenutniPass;
	var noviPass = req.body.noviPass;
	var email = req.body.email;

	var hash = bcrypt.hashSync(noviPass, 10);

	var sql = `SELECT *
			   FROM Korisnik
			   WHERE ID = ?`;

	db.all(sql, [idKorisnika], function (err, rows)
	{
		if (err || rows.length == 0)
			res.json({ success: false });
		else
		{
			if (bcrypt.compareSync(trenutniPass, rows[0].password) == false)
				res.json({ success: true, stariPass: false });
			else
			{
				var sql;

				if (email == "")
				{
					sql = `UPDATE Korisnik
						   SET password = ?
						   WHERE ID = ?`;

					db.run(sql, [hash, idKorisnika], function (err)
					{
						if (err)
							res.json({ success: false });
						else
							res.json({ success: true });
					});
				}
				else
				{
					sql = `UPDATE Korisnik
						   SET password = ?, email = ? 
						   WHERE ID = ?`;

					db.run(sql, [hash, email, idKorisnika], function (err)
					{
						if (err)
							res.json({ success: false });
						else
							res.json({ success: true });
					});
				}


			}
		}
	});
});

router.post('/azurirajFajl', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idBota = req.body.idBota;
	var sadrzaj = req.body.kod;

	var sql = `SELECT *
			   FROM Bot
			   WHERE ID = ?`;

	db.all(sql, [idBota], function (err, rows)
	{
		if (err)
			res.json({ success: false });
		else
		{
			var rootDir = path.join(__dirname, '../../');
			var putanjaDoFajla = rootDir + rows[0].fajl;

			fs.writeFile(putanjaDoFajla, sadrzaj, function (err)
			{
				if (err)
					res.json({ success: false });
				else
					res.json({ success: true });
			});
		}
	});
});

// azuriranje jezika korisnika (vrsi se iz menija)
router.post("/azurirajJezikKorisnika", checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var jezik = req.body.jezik;
	var sql = `UPDATE Korisnik
			   SET jezik = ?
			   WHERE ID = ?`;

	db.run(sql, [jezik, idKorisnika], function (err)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

router.post('/promeniSifru', function (req, res, next)
{
	var id = req.body.idKorisnika;
	var password = req.body.password;

	var hash = bcrypt.hashSync(password, 10);

	sql = `update Korisnik set password = ? where id = ?`;

	db.run(sql, [hash, id], function (err)
	{
		if (err)
		{
			res.json({ success: false })

		}
		else
		{
			res.json({ success: true, msg: "PASSWORD_CHANGED" });
		}

	});
});


router.post('/aktivirajKorisnika', cors(corsOpcije), function (req, res, next)
{
	var kod = req.body.kod;

	db.serialize(function ()
	{//prvo proverim da li postoji taj korisnicki kod
		var dajKorisnickiKod = `select IdKorisnika,kod
							    from KorisnickiKodovi 
								where kod = ?`;

		db.all(dajKorisnickiKod, [kod], function (err, rows)
		{
			if (err) 
			{
				res.json({ "success": false, "msg": "Ne postoji u Korinickim Kodovi" })
			}

			else if (rows.length > 0)
			{


				var id = rows[0].IdKorisnika;

				var dajKorisnika = `select *
								  	from Korisnik
									where ID = ?`;

				db.all(dajKorisnika, [id], function (err, rows)
				{
					if (err) 
					{
						res.json({ "success": false, "msg": "Ne postoji u Korisniku" })
					}
					else if (rows.length > 0)
					{
						if (rows[0].potvrdjen == "false")
						{
							var izbrisiIzKorisnickiKodovi = `delete from KorisnickiKodovi where IdKorisnika = ?`;
							var promeniUkorisnikuDaJeAktiviran = `update Korisnik set potvrdjen='true' where id = ?`;

							db.run(promeniUkorisnikuDaJeAktiviran, [id], function (err)
							{
								if (err)
								{
									res.json({ "success": false, "msg": "Los update" })
								}

								else
								{
									db.run(izbrisiIzKorisnickiKodovi, [id], function (err)
									{
										if (err)
										{

											res.json({ "success": false, "msg": "Los delete" })
										}
										else
										{
											res.json({ "success": true, msg: "Odradjen update i delete" })
										}
									})
								}
							})
						}
						else
						{
							res.json({ "success": true, "msg": "Korisnik je aktiviran" })
						}
					}
				})
			}
		})
	});
});

router.post('/procitajNotifikaciju', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idNotifikacije = req.body.idNotifikacije;
	var sql = `UPDATE Notifikacija
			   SET procitana = 'true'
			   WHERE ID = ?`;

	db.run(sql, [idNotifikacije], function (err, rows)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

module.exports = router;