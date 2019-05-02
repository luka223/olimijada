var schedule = require('node-schedule');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
var mongoFunkcije = require('./mongo-rute').funkcije;

// konstante za vremena u milisekunda, zbog lakseg koriscenja Date objekta
const SEKUNDA = 1000;
const SAT = 3600000;
const DAN = 86400000;

function randomPoeni()
{
	return 1 + Math.floor(Math.random() * 7);
}

function zavrsiTurnir(idTurnira, nazivTurnira)
{
	mongoFunkcije.zatvoriTurnirIVratiPobednika(idTurnira, function (pobednik, brojKola)
	{
		var rankPoeni = (brojKola * (brojKola + 1)) / 2 * 10;

		var sql = `SELECT *
				   FROM TimBot
				   WHERE idTima = ${pobednik.idTima}`;

		db.all(sql, function (err, rows)
		{
			rows.forEach(el =>
			{
				var sql = `UPDATE Bot
						   SET rankPoeni = ${rankPoeni}
						   WHERE ID = ${el.idBota}`;

				db.run(sql);
			});
		});

		var text = `Congratulations! Your team ${pobednik.nazivTima} has won tournament ${nazivTurnira}`;
		var tekst = `Čestitamo! Vaš tim ${pobednik.nazivTima} je osvojio turnir ${nazivTurnira}`;

		sql = `INSERT INTO Notifikacija(text, tekst, idKorisnika)
			   VALUES('${text}', '${tekst}', ${pobednik.idKorisnika})`;

		db.run(sql);
	});
}

// ukoliko je prijavljen 0 ili 1 tim, obrisati turnir
function proveriTimove(idTurnira, brojTimova)
{
	if (brojTimova < 2)
	{
		// ako nema timova ni jedan mec da se odigra, obrisi turnir
		mongoFunkcije.obrisiTurnir(idTurnira);
		return false; // provera neuspesna, ne igra se turnir
	}
	else
		return true; // provera uspesna, igra se turnir
}

// rotacija niza za pravljenje kola u ligi sa parnim brojem timova
function rotirajNizZaParanBroj(niz)
{
	var i = 1;
	var t = niz[i];

	while (i < niz.length - 1)
	{
		niz[i] = niz[i + 1];
		i++;
	}

	niz[i] = t;
}

// rotacija niza za pravljenje kola u ligi sa neparnim brojem timova
function rotirajNizZaNeparanBroj(niz)
{
	var i = 0;
	var t = niz[i];

	while (i < niz.length - 1)
	{
		niz[i] = niz[i + 1];
		i++;
	}

	niz[i] = t;
}

// formira jedno kolo lige i rotira niz za sledece koristeci odgovarajucu funkciju za rotiranje
function formirajKolo(idTurnira, nazivTurnira, ucesnici, kolo, datumUtakmice)
{
	var n = ucesnici.length;
	if (kolo > n || (kolo == n && n % 2 == 0))
		return;

	if (n % 2 == 1)
		n--;

	var mecevi = [];

	for (let i = 0; i < n / 2; i++)
	{
		var datumMeca = new Date(datumUtakmice.getTime() + i * SAT / 4);
		mecevi.push({ idTima1: ucesnici[i].idTima, idTima2: ucesnici[n - i - 1].idTima, poeniTima1: 0, poeniTima2: 0, pocetakMeca: datumMeca, zavrsen: false });

		schedule.scheduleJob(new Date(datumMeca), function (ucesnik1, ucesnik2, datumPocetka)
		{
			// OVDE BI TREBALO DA SE SALJE ZAHTEV GAME SERVERU

			// ODIGRAVANJE MECA (BEZ GAME SERVERA)
			let poeniTima1 = randomPoeni();
			let poeniTima2 = randomPoeni();

			mongoFunkcije.azurirajRezultat(idTurnira, kolo, ucesnik1.idTima, ucesnik2.idTima, poeniTima1, poeniTima2);

			// obavestavanje korisnika prvog tima
			var text = `Your team ${ucesnik1.nazivTima} has finished match against ${ucesnik2.nazivTima} with score ${poeniTima1}:${poeniTima2}`;
			var tekst = `Vaš tim ${ucesnik1.nazivTima} je završio meč protiv tima ${ucesnik2.nazivTima} rezultatom ${poeniTima1}:${poeniTima2}`;
			var sql = `INSERT INTO Notifikacija(text, tekst, idKorisnika)
					   VALUES('${text}', '${tekst}', ${ucesnik1.idKorisnika})`;
			db.run(sql);

			// obavestavanje korisnika drugog tima
			text = `Your team ${ucesnik2.nazivTima} has finished match against ${ucesnik1.nazivTima} with score ${poeniTima2}:${poeniTima1}`;
			tekst = `Vaš tim ${ucesnik2.nazivTima} je završio meč protiv tima ${ucesnik1.nazivTima} rezultatom ${poeniTima2}:${poeniTima1}`;
			sql = `INSERT INTO Notifikacija(text, tekst, idKorisnika)
				   VALUES('${text}', '${tekst}', ${ucesnik2.idKorisnika})`;
			db.run(sql);

			// azuriranje statistike
			if (poeniTima1 > poeniTima2)
			{
				db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPobeda = brojPobeda + 1 WHERE ID = ${ucesnik1.idTima}`);
				db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPoraza = brojPoraza + 1 WHERE ID = ${ucesnik2.idTima}`);
			}
			else if (poeniTima1 < poeniTima2)
			{
				db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPoraza = brojPoraza + 1 WHERE ID = ${ucesnik1.idTima}`);
				db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPobeda = brojPobeda + 1 WHERE ID = ${ucesnik2.idTima}`);
			}
			else
			{
				db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1 WHERE ID = ${ucesnik1.idTima}`);
				db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1 WHERE ID = ${ucesnik2.idTima}`);
			}

			if (kolo == n || (kolo == n - 1 && n % 2 == 0))
			{

				zavrsiTurnir(idTurnira, nazivTurnira);
				return;
			}

		}.bind(null, ucesnici[i], ucesnici[n - i - 1], datumUtakmice));
	}

	mongoFunkcije.dodajKolo(idTurnira, kolo, mecevi);

	if (ucesnici.length % 2 == 0)
		rotirajNizZaParanBroj(ucesnici);
	else
		rotirajNizZaNeparanBroj(ucesnici);

	formirajKolo(idTurnira, nazivTurnira, ucesnici, kolo + 1, new Date(datumMeca.getTime() + 2 * SAT));
}

function formirajRundu(idTurnira, nazivTurnira, ucesnici, brojMeceva, datumPocetkaRunde)
{
	var mecevi = [];
	let n = ucesnici.length;

	if (n == 1)
	{
		zavrsiTurnir(idTurnira, nazivTurnira);
		return; // turnir je zavrsen, ostao je jedan tim
	}

	for (let i = 0; i < brojMeceva; i++)
	{
		var datumMeca = new Date(datumPocetkaRunde.getTime() + i * SAT / 4);
		if (i < n - brojMeceva)
			mecevi.push({ idTima1: ucesnici[i].idTima, idTima2: ucesnici[n - i - 1].idTima, poeniTima1: 0, poeniTima2: 0, pocetakMeca: datumMeca, zavrsen: false });
		else
			mecevi.push({ idTima1: ucesnici[i].idTima, idTima2: null, poeniTima1: 0, poeniTima2: 0, pocetakMeca: new Date(), zavrsen: true });

		schedule.scheduleJob(new Date(datumMeca), function (ucesnik1, ucesnik2, mec)
		{
			if (mec.idTima2 != null)
			{
				mec.poeniTima1 = randomPoeni();
				mec.poeniTima2 = randomPoeni();

				if (mec.poeniTima1 == mec.poeniTima2)
					mec.poeniTima1++;
			}

			if (mec.idTima2 != null)
			{
				mongoFunkcije.azurirajRezultat(idTurnira, brojMeceva, mec.idTima1, mec.idTima2, mec.poeniTima1, mec.poeniTima2);

				// obavestavanje korisnika prvog tima
				var text = `Your team ${ucesnik1.nazivTima} has finished match against ${ucesnik2.nazivTima} with score ${mec.poeniTima1}:${mec.poeniTima2}`;
				var tekst = `Vaš tim ${ucesnik1.nazivTima} je završio meč protiv tima ${ucesnik2.nazivTima} rezultatom ${mec.poeniTima1}:${mec.poeniTima2}`;
				var sql = `INSERT INTO Notifikacija(text, tekst, idKorisnika)
					       VALUES('${text}', '${tekst}', ${ucesnik1.idKorisnika})`;
				db.run(sql);

				// obavestavanje korisnika drugog tima
				text = `Your team ${ucesnik2.nazivTima} has finished match against ${ucesnik1.nazivTima} with score ${mec.poeniTima2}:${mec.poeniTima1}`;
				tekst = `Vaš tim ${ucesnik2.nazivTima} je završio meč protiv tima ${ucesnik1.nazivTima} rezultatom ${mec.poeniTima2}:${mec.poeniTima1}`;
				sql = `INSERT INTO Notifikacija(text, tekst, idKorisnika)
					   VALUES('${text}', '${tekst}', ${ucesnik2.idKorisnika})`;
				db.run(sql);

				// azuriranje statistike
				if (mec.poeniTima1 > mec.poeniTima2)
				{
					db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPobeda = brojPobeda + 1 WHERE ID = ${ucesnik1.idTima}`);
					db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPoraza = brojPoraza + 1 WHERE ID = ${ucesnik2.idTima}`);
				}
				else if (mec.poeniTima1 < mec.poeniTima2)
				{
					db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPoraza = brojPoraza + 1 WHERE ID = ${ucesnik1.idTima}`);
					db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1, brojPobeda = brojPobeda + 1 WHERE ID = ${ucesnik2.idTima}`);
				}
				else
				{
					db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1 WHERE ID = ${ucesnik1.idTima}`);
					db.run(`UPDATE Tim SET brojMeceva = brojMeceva + 1 WHERE ID = ${ucesnik2.idTima}`);
				}
			}

		}.bind(null, ucesnici[i], ucesnici[n - i - 1], mecevi[i]));
	}

	mongoFunkcije.dodajKolo(idTurnira, brojMeceva, mecevi);

	// 2 sata nakon pocetka meceva, formiraj sledecu rundu
	var dat = new Date(datumMeca.getTime() + 60 * SEKUNDA); // vrati na SAT

	schedule.scheduleJob(dat, function (mecevi, brojMeceva, datumPocetka)
	{
		var ucesniciNaredneRunde = [];

		// prolazi kroz meceve i uzima pobednike
		for (let i = 0; i < brojMeceva; i++)
		{
			if (mecevi[i].idTima2 == null || mecevi[i].poeniTima1 > mecevi[i].poeniTima2)
				ucesniciNaredneRunde.push(ucesnici.find(x => x.idTima == mecevi[i].idTima1));
			else
				ucesniciNaredneRunde.push(ucesnici.find(x => x.idTima == mecevi[i].idTima2));
		}

		formirajRundu(idTurnira, nazivTurnira, ucesniciNaredneRunde, brojMeceva / 2, new Date(datumPocetka.getTime() + 30 * SEKUNDA));
	}.bind(null, mecevi, brojMeceva, dat));
}

function formirajMeceveLige(idTurnira, nazivTurnira, datumPocetkaTurnira)
{
	var datum = new Date(datumPocetkaTurnira);

	schedule.scheduleJob(datum, function ()
	{
		mongoFunkcije.vratiPrijavljeneTimove(idTurnira, function (ucesnici)
		{
			if (proveriTimove(idTurnira, ucesnici.length))
			{
				var kolo = 1;
				datum.setTime(datum.getTime() + 60 * SEKUNDA);

				formirajKolo(idTurnira, nazivTurnira, ucesnici, kolo, datum);
			}
		});
	});
}

function formirajMeceveKupa(idTurnira, nazivTurnira, datumPocetkaTurnira)
{

	schedule.scheduleJob(datumPocetkaTurnira, function ()
	{
		mongoFunkcije.vratiPrijavljeneTimove(idTurnira, function (ucesnici)
		{
			if (proveriTimove(idTurnira, ucesnici.length))
			{
				let stepenDvojke = Math.ceil(Math.log2(ucesnici.length));
				let brojMeceva = Math.pow(2, stepenDvojke) / 2;

				formirajRundu(idTurnira, nazivTurnira, ucesnici, brojMeceva, new Date(datumPocetkaTurnira.getTime() + 60 * SEKUNDA));
			}
		});
	});
}

module.exports.funkcije = {
	// Funkcije koje se pozivaju pri kreiranju turnira
	formirajMeceveLige: formirajMeceveLige,
	formirajMeceveKupa: formirajMeceveKupa
}