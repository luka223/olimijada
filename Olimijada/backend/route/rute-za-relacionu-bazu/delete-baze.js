const express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
const checkAuth = require('./check-auth');
var path = require('path');
var fs = require('fs');
// Podesavanje CORS-a da prihvata zahteve samo iz frontend aplikacije
var cors = require('cors');
var schedule = require('node-schedule');
var const_adr = require("../../config/const");
var corsOpcije =
	{

		origin: const_adr.frontend,
		optionsSuccessStatus: 200,
		exposedHeaders: 'Token'
	};

// brisanje botova iz tima, koje se poziva iz spiska botova u jednom timu na profilnoj strani
router.post('/obrisiBotaIzTima', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var idBota = req.body.idBota;

	var sql = "DELETE FROM TimBot WHERE idBota = ? AND idTima = ?";
	db.run(sql, [idBota, idTima], function (err)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

// brise bota iz tabele botova, baza ce sama izvrsisi ostala kaskadna brisanja
router.post('/obrisiBota', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idBota = req.body.idBota;

	var sql = `SELECT *
			   FROM Bot
			   WHERE ID = ?`;

	db.all(sql, [idBota], function (err, rows)
	{
		var rootDir = path.join(__dirname, '../../');
		var putanjaDoFajla = rootDir + rows[0].fajl;

		fs.unlink(putanjaDoFajla, function (err)
		{
			if (err)
				res.json({ success: false });
			else
			{
				sql = `DELETE FROM Bot
			  		   WHERE ID = ${idBota}`;

				db.run(sql, function (err)
				{
					if (err)
						res.json({ success: false });
					else
						res.json({ success: true });
				});
			}
		});
	});
});

// brise tim iz tabele timova, baza ce sama izvrsisi ostala kaskadna brisanja
router.post('/obrisiTim', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;

	var sql = `DELETE FROM Tim
			   WHERE ID = ?`;

	db.run(sql, [idTima], function (err)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true });
	});
});

module.exports = router;