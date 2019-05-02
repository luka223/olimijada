var express = require('express');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
var app = express();
var bCrypt = require('bcrypt');/*
var sqlite3 = require('sqlite3').verbose();
var db = require('./config/database');*/
var multer = require('multer');
//var mongoose = require('mongoose');
var bodyparser = require('body-parser');
app.use(bodyparser.json());
var cors = require('cors');

var schedule = require('node-schedule');
app.use(cors());
function aktiviraniKorisnici()
{

	var j = schedule.scheduleJob('1 * * * *', function ()
	{
		upit = `select * from KorisnickiKodovi
		where julianday('now','-1 hours')-datumUnosa>0`;

		
		db.all(upit, function (err, rows)
		{
			if (err)
			{
				//console.log("greska sa bazom");
			}
			else
			{

				if (rows.length != 0)
				{
					for (var i = 0; i < rows.length; i++)
					{
						var id = rows[i].IdKorisnika;
						brisanjeIzKorisinickihKodova = `Delete from KorisnickiKodovi where IdKorisnika=${id}`;
						brisanjeIzKorisinika = `Delete from Korisnik where ID=${id}`;
						db.run(brisanjeIzKorisinickihKodova, function (err)
						{
							if (err) {}
							else
							{
								db.run(brisanjeIzKorisinika, function (err)
								{
									
								})
							}
						})

					}
				}
			}
		});

	});
}

var login = require('./route/rute-za-relacionu-bazu/login');
app.use("/login", login);

var registracija = require('./route/rute-za-relacionu-bazu/registracija')
app.use("/registracija", registracija);

var upload = require('./route/rute-za-relacionu-bazu/upload');
app.use('/upload', upload);

var updateBaze = require('./route/rute-za-relacionu-bazu/update-baze');
app.use('/update', updateBaze);

var selectBaze = require('./route/rute-za-relacionu-bazu/select-baze');
app.use('/select', selectBaze);

var deleteBaze = require('./route/rute-za-relacionu-bazu/delete-baze');
app.use('/delete', deleteBaze);

var insertUBazu = require('./route/rute-za-relacionu-bazu/insert-u-bazu');
app.use('/insert', insertUBazu);

// var selectNerelaciona = require('./route/rute-za-nerelacionu-bazu/select-nerelaciona');
// app.use("/selNer", selectNerelaciona);

var admin = require('./route/rute-za-relacionu-bazu/admin');
app.use("/admin", admin);

var mongoRute = require('./route/mongo-rute').router;
app.use('/mongo', mongoRute);

const PORT = 11038;

//body-parser



app.listen(PORT, () =>
{
	console.log('Server has been started on port: ' + PORT);
	aktiviraniKorisnici();
});



