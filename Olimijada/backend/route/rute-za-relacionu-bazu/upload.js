const express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
// Podesavanje CORS-a da prihvata zahteve samo iz frontend aplikacije
var cors = require('cors');

var const_adr=require("../../config/const");
var corsOpcije =
	{
		origin: const_adr.frontend,
		optionsSuccessStatus: 200,
		exposedHeaders: ['Token', 'TokenAdmin']
	};
//upload
var multer = require('multer');
var checkAuth = require('./check-auth');
var checkAuthAdmin = require('./check-auth-admin');
var proveriNavodnike = require('../../config/checkQuotationMarks');

const uploadPath = "./uploads/";
const ogranicenjeBotovi = 250; //maksimalni broj botova koje korisnik moze da ima
const profilnaSize = 1024 * 1024 * 5; //5MB maksimalna velicina profilne slike
const grbSize = 1024 * 1024 * 5;
const tereniSize = 1024 * 1024 * 5;
const slikeIgreSize = 1024 * 1024 * 5;
const ikoneIgreSize = 1024 * 1024 * 5;

//podesavanja za profilnu sliku: gde se cuva slika i njen naziv
const profilnaStorage = multer.diskStorage({
	destination: function (req, file, cb)
	{
		cb(null, uploadPath + 'profilneSlike')
	},
	filename: function (req, file, cb)
	{
		var name = file.fieldname + "_" + req.params.idKorisnika + ".png";
		cb(null, name);
	}
});
const slikaFilter = (req, file, cb) =>
{
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
	{
		cb(null, true);
	}
	else
	{
		cb(null, false);
	}
}
var uploadProfilne = multer({
	storage: profilnaStorage,
	fileFilter: slikaFilter,
	limits: profilnaSize
});

//podesavanja za bota
const botStorage = multer.diskStorage({
	destination: function (req, file, cb)
	{
		cb(null, uploadPath + 'botovi')
	},
	filename: function (req, file, cb)
	{
		var name = req.params.idKorisnika + "-" + req.params.nazivBota + "-" + file.originalname;
		cb(null, name);
	}
});

const botFilter = (req, file, cb) =>
{
	if (file.mimetype === 'text/plain')
	{ //za sad samo txt fajlove da prihvatamo
		//ako vec ima maksimalni broj botova da ne cuvam fajl
		var sqlBrojBotova = "select count(*) as brojBotova from bot group by idKorisnika having idKorisnika = " + req.params.idKorisnika;
		db.get(sqlBrojBotova, (err, row) =>
		{
			if (err === null)
			{
				if (row === undefined)
				{//u slucaju da nema nijednog bota
					cb(null, true);
				}
				else
				{
					if (row.brojBotova < ogranicenjeBotovi)
					{
						cb(null, true);
					}
					else
					{
						cb(null, false);
					}
				}
			}
			else
			{
				cb(null, false);
			}
		});
	}
	else
	{
		cb(null, false);
	}
}
var uploadBota = multer({
	storage: botStorage,
	fileFilter: botFilter
});

const grbStorage = multer.diskStorage({
	destination: function (req, file, cb)
	{
		cb(null, uploadPath + 'grbovi');
	},
	filename: function (req, file, cb)
	{
		var name = file.fieldname + "_" + req.params.idTima + ".png";
		cb(null, name);
	}
});
var uploadGrb = multer({
	storage: grbStorage,
	fileFilter: slikaFilter,
	limits: grbSize
});

//tereni slike
const tereniIgreStorage = multer.diskStorage({
	destination: function(req, file, cb)
	{
		cb(null, uploadPath + 'tereniIgara');
	},
	filename: function (req, file, cb)
	{
		var name = file.fieldname + "_" + req.params.idIgre + ".jpg";
		cb(null, name);
	}
});

var uploadTereniIgre = multer({
	storage: tereniIgreStorage,
	fileFilter: slikaFilter,
	limits: tereniSize
});

//slike igre
const slikeIgreStorage = multer.diskStorage({
	destination: function(req, file, cb)
	{
		cb(null, uploadPath + 'slikeIgara');
	},
	filename: function (req, file, cb)
	{
		var name = file.fieldname + "_" + req.params.idIgre + ".jpg";
		cb(null, name);
	}
});

var uploadSlikeIgre = multer({
	storage: slikeIgreStorage,
	fileFilter: slikaFilter,
	limits: slikeIgreSize
});

//ikone igre
const ikoneIgreStorage = multer.diskStorage({
	destination: function(req, file, cb)
	{
		cb(null, uploadPath + 'ikoneIgara');
	},
	filename: function (req, file, cb)
	{
		var name = file.fieldname + "_" + req.params.idIgre + ".jpg";
		cb(null, name);
	}
});

var uploadIkoneIgre = multer({
	storage: ikoneIgreStorage,
	fileFilter: slikaFilter,
	limits: ikoneIgreSize
});

//ruta za upload slike igre
router.post('/slikaIgre/:idIgre', checkAuthAdmin, cors(corsOpcije), uploadSlikeIgre.single('slikaigre'), function(req, res, next)
{
	if(req.file != undefined)
	{
		var sql = `UPDATE Igra
				   SET slika = ?
				   WHERE ID = ?`;

		db.run(sql, [req.file.path, req.params.idIgre], function (err)
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
	else
	{
		res.json({ success: false });
	}
});

//ruta za upload ikone igre
router.post('/ikonaIgre/:idIgre', checkAuthAdmin, cors(corsOpcije), uploadIkoneIgre.single('ikonaigre'), function(req, res, next)
{
	if(req.file != undefined)
	{
		var sql = `UPDATE Igra
				   SET ikona = ?
				   WHERE ID = ?`;

		db.run(sql, [req.file.path, req.params.idIgre], function (err)
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
	else
	{
		res.json({ success: false });
	}
});


//ruta za upload pozadine igre
router.post('/pozadinaIgre/:idIgre', checkAuthAdmin, uploadTereniIgre.single('pozadinaigre'),  function(req, res, next)
{
	if(req.file != undefined)
	{
		var sql = `UPDATE Igra
				   SET pozadina = ?
				   WHERE ID = ?`;

		db.run(sql, [req.file.path, req.params.idIgre], function (err)
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
	else
	{
		res.json({ success: false });
	}
});



router.post('/profilna/:idKorisnika', checkAuth, cors(corsOpcije), uploadProfilne.single('profilna'), function (req, res, next)
{
	if (req.file != undefined)
	{
		var sql = `UPDATE Korisnik
				   SET slika = ?
				   WHERE ID = ?`;

		db.run(sql, [req.file.path, req.params.idKorisnika], function (err)
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
	else
	{
		res.json({ success: false });
	}
});

router.post('/dodajBota/:idKorisnika&:nazivBota&:idIgre', checkAuth, cors(corsOpcije), uploadBota.single('bot'), function (req, res, next)
{
	var nazivBota = req.params.nazivBota;
	var nazivNovi = proveriNavodnike.checkQuotationMarks(nazivBota);
	var idKorisnika = req.params.idKorisnika;
	var idIgre = req.params.idIgre;

	if (req.file != undefined)
	{
		var sql = `SELECT * FROM Bot
				   WHERE idKorisnika = ? AND naziv = ?`;

		db.all(sql, [idKorisnika, nazivBota], function (err, rows)
		{
			// provera da korisnik nema vec bota sa takvim imenom
			if(rows.length == 0)
			{
				sql = `INSERT INTO Bot(naziv, fajl, idKorisnika, idIgre)
					   VALUES (?, ?, ?, ?)`;
			
				db.run(sql, [nazivNovi, req.file.path, idKorisnika, idIgre], function (err)
				{
					if (err)
						res.json({ success: false });
					else
						res.json({ success: true });
				});
			}
			else
				res.json({ success: false, postojiBotSaIstimImenom: true });
		});

	}
	else
	{
		res.json({ success: false });
	}
});

router.post('/postaviGrb/:idTima', checkAuth, cors(corsOpcije), uploadGrb.single('grb'), function (req, res, next)
{
	if (req.file != undefined)
	{
		var sql = "UPDATE Tim SET grb = ? WHERE ID = ?";

		db.run(sql, [req.file.path, req.params.idTima], function (err)
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
	else
	{
		res.json({ success: false });
	}
});

module.exports = router;