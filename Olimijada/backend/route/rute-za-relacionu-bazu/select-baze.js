const express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');

const checkAuth = require('./check-auth');
const checkAuthUserOrAdmin = require("./check-admin-or-user");

var path = require('path');
// Podesavanje CORS-a da prihvata zahteve samo iz frontend aplikacije
var cors = require('cors');

var const_adr = require("../../config/const");
var jwt = require('jsonwebtoken');
var corsOpcije =
{

	origin: const_adr.frontend,
	optionsSuccessStatus: 200,
	exposedHeaders: ['Token', "TokenAdmin"]
};

router.post('/vratiTipoveTurnira', cors(corsOpcije), function (req, res, next)
{
	var sql = `SELECT * FROM TipTurnira`;

	db.all(sql, function (err, rows)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true, tipovi: rows });
	})
});

//najpopularnije igre - slajder
router.post('/vratiNajpopualrnijeIgre', cors(corsOpcije), function (req, res, next)
{
	db.all("select bm.idIgre as ID, s.naziv, bm.ukupno from (SELECT idIgre, sum(brojMeceva) as ukupno	FROM KorisnikIgra GROUP BY idIgre ORDER BY sum(brojMeceva) desc) bm join Igra s on bm.idIgre = s.id limit 5", function (err, rows)
	{
		res.json(rows);
	});
});

//opis odredjene igre
router.post('/igraOpis', cors(corsOpcije), function (req, res, next)
{
	var idIgre = req.body.idIgre;
	var sql = `SELECT *
			   FROM Igra
			   WHERE ID = ?`;

	db.all(sql, [idIgre], function (err, rows)
	{
		res.json(rows);
	});
});

// vraca sve korisnikove botove i koristi se na profilnoj strani u delu botovi
router.post('/vratiBotoveKorisnika', checkAuthUserOrAdmin, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;

	db.all(`SELECT * FROM Bot WHERE idKorisnika = ${idKorisnika}`, function (err, rows)
	{
		res.json(rows);
	});
});

// vraca sve korisnikove timove i koristi se na profilnoj strani u delu timovi
router.post('/vratiTimove', checkAuthUserOrAdmin, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var sql = "SELECT t.*, i.naziv as nazivIgre FROM Tim t JOIN Igra i ON t.idIgre = i.id WHERE idKorisnika = ?";

	db.all(sql, [idKorisnika], function (err, rows)
	{
		res.json(rows);
	});
});

// vraca sve botova tima i koristi se na profilnoj strani pri kliku na tim
router.post('/vratiBotoveTima', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;

	var sql = "SELECT * FROM TimBot tb JOIN Bot b ON tb.idBota = b.ID WHERE tb.idTima = ?";

	db.all(sql, [idTima], function (err, rows)
	{
		res.json(rows);
	});
});

//najbolji timovi za odredjenu igru
router.post('/najboljiTimovi', cors(corsOpcije), function (req, res, next)
{
	var idIgre = req.body.idIgre;

	var sql = `select * from (select tb.idTima, t.naziv, sum(b.rankPoeni) as ukupnoPoena 
				from tim t join timbot tb on t.ID = tb.idTima join bot b on tb.idBota = b.ID 
				where t.idIgre = ?
				group by tb.idTima, t.naziv) s order by s.ukupnoPoena desc`;

	db.all(sql, [idIgre], function (err, rows)
	{
		res.json(rows);
	});
});

//najbolji timovi korisnika za odredjenu igru
router.post('/mojiNajboljiTimovi', checkAuth, function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var idIgre = req.body.idIgre;


	var sql = `select * from (select tb.idTima, t.naziv, sum(b.rankPoeni) as ukupnoPoena 
				from tim t join timbot tb on t.ID = tb.idTima join bot b on tb.idBota = b.ID
				where t.idIgre = ?  and t.idKorisnika = ?
				group by tb.idTima, t.naziv) s order by s.ukupnoPoena desc`;

	db.all(sql, [idIgre, idKorisnika], function (err, rows)
	{
		res.json(rows);
	});
});

//(home page kada je korisnik ulogovan, 5 ili manje najboljih botova tog korisnika)
router.post('/vratiNajboljeBotoveKorisnika', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var sql = `SELECT *	
			   FROM Bot
			   WHERE idKorisnika = ?
			   ORDER BY Bot.rankPoeni DESC	LIMIT 5`;

	db.all(sql, [idKorisnika], function (err, rows)
	{
		res.json(rows);
	});
});

//(home page kada je korisnik ulogovan, 5 ili manje sportova koje je korisnik najvise igrao)
router.post('/vratiPetNajpopularnijihIgaraKorisnika', cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var sql = "SELECT s.ID, s.naziv FROM KorisnikIgra ks JOIN Igra s ON ks.idIgre = s.ID WHERE ks.idKorisnika = ? ORDER BY ks.brojMeceva DESC LIMIT 5";

	db.all(sql, [idKorisnika], function (err, rows)
	{
		if (rows.length < 2)
		{
			// ukoliko je korisnik igrao manje od dve igre, vrati 5 globalno najpopularnijih igara
			db.all("select bm.idIgre as ID, s.naziv, bm.ukupno from (SELECT idIgre, sum(brojMeceva) as ukupno	FROM KorisnikIgra GROUP BY idIgre ORDER BY sum(brojMeceva) desc) bm join Igra s on bm.idIgre = s.id limit 5", function (err, rows)
			{
				res.json(rows);
			});
		}
		else
			res.json(rows);
	});
});

router.post('/sveIgre', cors(corsOpcije), function (req, res, next)
{
	var sql = 'SELECT * FROM Igra';

	db.all(sql, function (err, rows)
	{
		res.json(rows);
	});
});

// lista igara u meniju kada korisnik nije ulogovan
router.post('/sveIgreSortiraneGlobalno', cors(corsOpcije), function (req, res, next)
{
	var sql = `SELECT i.ID, i.naziv
			   FROM Igra i LEFT JOIN KorisnikIgra ki
			   ON i.ID = ki.idIgre
			   GROUP BY i.ID, i.naziv
			   ORDER BY SUM(ki.brojMeceva) DESC`

	db.all(sql, function (err, rows)
	{
		res.json(rows);
	});
});

router.post('/sveIgreSortiranePoKorisniku', cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var sql = `SELECT i.ID, i.naziv
			   FROM Igra i LEFT JOIN KorisnikIgra ki
			   ON i.ID = ki.idIgre AND ki.idKorisnika = ?
			   GROUP BY i.ID, i.naziv
			   ORDER BY SUM(ki.brojMeceva) DESC`;

	db.all(sql, [idKorisnika], function (err, rows)
	{
		res.json(rows);
	});
});

router.post('/botoviKorisnikaZaOdredjenuIgru', cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var idIgre = req.body.idIgre;

	var sql = `SELECT * FROM Bot WHERE idKorisnika = ? AND idIgre = ?`;

	db.all(sql, [idKorisnika, idIgre], function (err, rows)
	{
		res.json(rows);
	});

});

router.post('/vratiIgruZaId', cors(corsOpcije), function (req, res, next)
{
	var idIgre = req.body.idIgre;

	var sql = `select * from Igra where ID = ?`;

	db.all(sql, [idIgre], function (err, rows)
	{
		if (err)
			res.json({ "msg": "greska sa upitom", success: false })
		else
			res.json({ "igra": rows[0], success: true })

	});
});

//ruta koja sluzi se za vracanje grba tima, koristi se koristi se na strani meca   
router.get('/vratiGrbTima/:idTima', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.params.idTima;

	var sql = "SELECT grb FROM Tim WHERE ID = ?";

	var rootDir = path.join(__dirname, '../../');
	db.all(sql, [idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			if (rows.length > 0 && rows[0].grb != null)
			{
				res.sendFile(rows[0].grb, { root: rootDir });
			}
			else
			{
				res.sendFile("./uploads/grbovi/grbDefault.png", { root: rootDir });
			}
		}
	});
});

//strana meca - potrebno za statistiku
router.post(`/vratiUkupnePoeneTimaKaoDomacina`, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sqlPoeniKaoDomacin = `SELECT sum(poeniDomacina) AS 'ukupnoPoeniKaoDomacin' 
	FROM Utakmica 
	WHERE idDomacina = ?`;

	db.all(sqlPoeniKaoDomacin, [idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, "poeniD": rows[0].ukupnoPoeniKaoDomacin });
		}
	});
});

//strana meca - potrebno za statistiku
router.post(`/vratiUkupnePoeneTimaKaoGosta`, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sqlPoeniKaoGost = `SELECT sum(poeniGosta) AS 'ukupnoPoeniKaoGost' 
	FROM Utakmica 
	WHERE idGosta = ?`;

	db.all(sqlPoeniKaoGost, [idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{

			res.json({ success: true, "poeniG": rows[0].ukupnoPoeniKaoGost });
		}
	});

});

//strana meca - potrebno za statistiku
router.post(`/vratiBrojOdigranihMecevaTima`, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sqlBrOdigranihMeceva = `SELECT count(*) AS 'brojOdigranihMeceva' 
	FROM Utakmica 
	WHERE idDomacina = ? OR idGosta = ?`;

	db.all(sqlBrOdigranihMeceva, [idTima, idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{

			res.json({ success: true, "brMeceva": rows[0].brojOdigranihMeceva });
		}
	});

});

//strana meca - potrebno za statistiku
router.post(`/vratiBrojPobedaTimaKaoDomacina`, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sqlBrPobedaKaoDomacin = `SELECT count(*) AS 'brojPobedaKaoDomacin' 
	FROM Utakmica 
	WHERE idDomacina = ? AND poeniDomacina > poeniGosta`;
	db.all(sqlBrPobedaKaoDomacin, [idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, "brPobedaD": rows[0].brojPobedaKaoDomacin });
		}
	});

});

//strana meca - potrebno za statistiku
router.post(`/vratiBrojPobedaTimaKaoGosta`, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sqlBrPobedaKaoGost = `SELECT count(*) AS 'brojPobedaKaoGost' 
	FROM Utakmica 
	WHERE idGosta = ? AND poeniGosta > poeniDomacina`;

	db.all(sqlBrPobedaKaoGost, [idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, "brPobedaG": rows[0].brojPobedaKaoGost });
		}
	});

});

//strana meca - potrebno za statistiku
router.post(`/vratiBrojNeresenihUtakmicaTima`, cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sqlNereseno = `SELECT count(*) AS 'brojNeresenihUtakmica' 
	FROM Utakmica 
	WHERE (idGosta = ? OR idDomacina = ?) AND poeniGosta = poeniDomacina`;

	db.all(sqlNereseno, [idTima, idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, "nereseno": rows[0].brojNeresenihUtakmica });
		}
	});
});

// ruta koja sluzi se za vracanje fajla bota, koristi se na profilnoj strani
router.get('/vratiFajlBota/:idBota', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idBota = req.params.idBota;
	var rootDir = path.join(__dirname, '../../');
	var sql = `SELECT fajl
			   FROM Bot
			   WHERE ID = ?`;

	db.all(sql, [idBota], function (err, rows)
	{
		if (err || rows.length == 0)
			res.json({ success: false });
		else
			res.sendFile(rows[0].fajl, { root: rootDir });
	});

});

//strana meca
router.post('/vratiNazivTima', cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sql = `SELECT naziv
			   FROM Tim
			   WHERE ID = ?`;

	db.all(sql, [idTima], function (err, rows)
	{
		if (err || rows.length == 0)
			res.json({ success: false });
		else
			res.json(rows[0].naziv);
	})
});


router.post('/vratiKorisnikaNaOsnovuUsernamea', cors(corsOpcije), function (req, res, next)
{
	var usernameKorisnika = req.body.username;

	var sql = `SELECT ID, username, slika
			   FROM Korisnik
			   WHERE username = ?`;

	db.all(sql, [usernameKorisnika], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, korisnik: rows[0] });
		}
	});
});

router.post('/vratiIgruPoNazivu', cors(corsOpcije), function (req, res, next)
{
	var naziv = req.body.nazivIgre;
	var sql = `SELECT *
			   FROM Igra
			   WHERE naziv = ?`;

	db.all(sql, [naziv], function (err, rows)
	{
		if (err || rows.length == 0)
		{
			res.json({ success: false });
		}
		else
		{
			if (rows[0] == undefined)
			{
				res.json({ success: true, postoji: false });
			}
			else
			{
				res.json({ success: true, postoji: true, igra: rows[0] });
			}
		}
	});
});

// za slajder
router.get('/vratiSlikuIgre/:idIgre', cors(corsOpcije), function (req, res, next)
{
	var idIgre = req.params.idIgre;

	var rootDir = path.join(__dirname, '../../');
	var sql = `SELECT slika
			   FROM Igra
			   WHERE ID = ?`;

	db.all(sql, [idIgre], function (err, rows)
	{
		if (err || rows.length == 0)
			res.json({ success: false });
		else
			res.sendFile(rows[0].slika, { root: rootDir });
	});
});

// za meni
router.get('/vratiIkonuIgre/:idIgre', cors(corsOpcije), function (req, res, next)
{
	var idIgre = req.params.idIgre;

	var rootDir = path.join(__dirname, '../../');
	var sql = `SELECT ikona
			   FROM Igra
			   WHERE ID = ?`;

	db.all(sql, [idIgre], function (err, rows)
	{
		if (err || idIgre == 0)
			res.json({ success: false });
		else
			res.sendFile(rows[0].ikona, { root: rootDir });
	});
});

router.get('/vratiPozadinuIgre/:idIgre', cors(corsOpcije), function (req, res, next)
{
	var idIgre = req.params.idIgre;

	var rootDir = path.join(__dirname, '../../');
	var sql = `SELECT pozadina
			   FROM Igra
			   WHERE ID = ?`;

	db.all(sql, [idIgre], function (err, rows)
	{
		if (err)
			res.json({ success: false });
		else
		{	
			if (rows[0].pozadina == null)
			{
				res.json({ success: false, msg: "no image" });
			}
			else
			{
				res.sendFile(rows[0].pozadina, { root: rootDir });
			}
		}
	});
});


//racunjanje rank poena korisnika na osnovu rank poena bota
router.post('/vratiRankPoeneKorisnika', cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var sql = `SELECT sum(b.rankPoeni) AS rankPoeni
			   FROM Korisnik k JOIN Bot b ON k.ID=b.idKorisnika
			   WHERE k.ID = ?`;

	db.all(sql, [idKorisnika], function (err, rows)
	{
		if (err || rows.length == 0)
		{
			res.json({ success: false });
		}
		else
		{
			if (rows[0].rankPoeni == null)
			{
				res.json({ success: false });
			}
			else
			{
				res.json({ success: true, rankPoeni: rows[0].rankPoeni });
			}
		}
	})
});

//timovi za prijavu ne neki turnir
router.post('/vratiTimoveKorisnikaZaIgru', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var idIgre = req.body.idIgre;
	var minRank = req.body.minRank;
	var maxRank = req.body.maxRank;
	var sql = `select * from (select t.id, sum(b.rankPoeni) as rank from tim t 
	join TimBot tb on t.ID = tb.idTima 
	join bot b on tb.idBota=b.ID
	group by t.id) s join tim t1 on s.ID = t1.ID
	WHERE idIgre = ? AND idKorisnika = ?  and s.rank between ${minRank} and ${maxRank}`;

	db.all(sql, [idIgre, idKorisnika], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			res.json({ success: true, timovi: rows });
		}
	})
});

router.post('/izracunajRankPoeneZaTim', cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sql = `SELECT sum(b.rankPoeni) as rankPoeni
				FROM Tim t join TimBot tb ON t.ID = tb.idTima join Bot b on tb.idBota = b.ID
				WHERE t.ID = ?
				GROUP BY t.ID`;

	db.all(sql, [idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			if (rows.length > 0)
			{
				res.json({ success: true, poeni: rows[0].rankPoeni });
			}
			else
			{
				res.json({ success: false });
			}

		}
	});
});

router.get('/vratiProfilnuSliku/:idKorisnika', cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.params.idKorisnika;

	var sql = `SELECT slika
				FROM Korisnik
				WHERE ID = ?`;
	var rootDir = path.join(__dirname, '../../');

	db.all(sql, [idKorisnika], function (err, rows)
	{
		if (err || rows.length == 0)
		{
			res.json({ success: false });
		}
		else
		{
			if (rows[0].slika != null)
			{
				res.sendFile(rows[0].slika, { root: rootDir });
			}
			else
			{
				res.sendFile("./uploads/profilneSlike/profilnaDefault.png", { root: rootDir });
			}
		}
	});
});

router.post('/vratiTimoveKorisnika', checkAuthUserOrAdmin, cors(corsOpcije), function (req, res, next)
{

	var username = req.body.username;
	sql = `select t.idIgre,t.naziv,t.idKorisnika,i.minBrojIgracaUTimu,t.ID as idTima,i.naziv as nazivIgre
	from Korisnik k join Tim t on k.ID=t.idKorisnika join Igra i on i.ID=t.idIgre 
	where k.username = ?`

	db.all(sql, [username], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false, msg: "Database problem" });
		}
		else
		{
			if (rows.length > 0)
			{
				res.json({ success: true, timovi: rows });
			}
			else
			{
				res.json({ success: false, msg: "NO_TEAMS" });
			}
		}
	})

});

router.post('/vratiProtivnickeTimoveZaIgru', cors(corsOpcije), function (req, res, next)
{

	var idIgre = req.body.idIgre;
	sql = `select i.minBrojIgracaUTimu,t.naziv,k.username
	from Igra i join tim t on i.ID=t.idIgre join Korisnik k on k.ID=t.idKorisnika
	where i.ID = ?`


	db.all(sql, [idIgre], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false, msg: "Database problem" });
		}
		else
		{
			if (rows.length > 0)
			{
				res.json({ success: true, protivnici: rows });
			}
			else
			{
				res.json({ success: false, msg: "NO_TEAMS" });
			}
		}
	})

});

router.post('/vratiTim', cors(corsOpcije), function (req, res, next)
{
	var idTima = req.body.idTima;
	var sql = `SELECT *
		       FROM Tim
			   WHERE ID = ?`;

	db.all(sql, [idTima], function (err, rows)
	{
		if (err)
		{
			res.json({ success: false });
		}
		else
		{
			if (rows.length > 0)
			{
				res.json({ success: true, tim: rows[0] });
			}
			else
			{
				res.json({ success: true, tim: null });
			}
		}
	})
});

router.post('/vratiNotifikacije', checkAuth, cors(corsOpcije), function (req, res, next)
{
	var idKorisnika = req.body.idKorisnika;
	var sql = `SELECT *
			   FROM Notifikacija
			   WHERE idKorisnika = ?
			   ORDER BY ID DESC`;

	db.all(sql, [idKorisnika], function (err, rows)
	{
		if (err)
			res.json({ success: false });
		else
			res.json({ success: true, notifikacije: rows });
	});
});

module.exports = router;