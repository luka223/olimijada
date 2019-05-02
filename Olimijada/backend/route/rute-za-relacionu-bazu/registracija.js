var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
//var db = require('../config/database'); //dodavanje konekcije sa bazon
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var sha1 = require('sha1');
var jwt = require('jsonwebtoken');
router.use(bodyParser.json());
var cors = require('cors');
var const_adr = require("../../config/const");
var corsOpcije =
	{

		origin: const_adr.frontend,
		optionsSuccessStatus: 200
	};


var reCAPTCHA = require('recaptcha2');
var recaptcha = new reCAPTCHA({
	siteKey: '6LdaBFsUAAAAALn9_imfzpIbfJa7H4IBXfPyeeyM',
	secretKey: '6LdaBFsUAAAAAJc2mL3fY9WwNFCvXNzYp8FOCRjT'
});


var mail_send = require("../mail_send");

function getRandomIntInclusive(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}


router.post('/', cors(corsOpcije), function (req, res, next)
{
	var username = req.body.username;
	var password = bcrypt.hashSync(req.body.password, 10);
	var email = req.body.email;
	var code = getRandomIntInclusive(100000, 999999);
	var recaptchaKey = req.body.recaptcha;

	var sql = `SELECT *
			   FROM Korisnik
			   WHERE username = '${username}' OR email = '${email}'`;

	db.serialize(function ()
	{
		db.all(sql, function (err, rows)
		{
			if (err)
				res.json({ success: false });
			else if (rows.length > 0)
			{
				if (rows[0].username == username)
					res.json({ success: false, userTaken: true });
				else if (rows[0].email == email)
					res.json({ success: false, emailTaken: true });
			}
			else
			{
				recaptcha.validate(recaptchaKey).then(function ()
				{
					var sql = `INSERT INTO Korisnik(username, password, email, idTipaKorisnika)
							   VALUES(?, ?, ?, 2)`;

					db.run(sql, [username, password, email], function (err)
					{
						if (err)
						{
							res.json({ success: false, msg: "Neuspesna registracija" });
						}
						else
						{
							var upit2 = "select max(id) as max,slika as slika ,idTipaKorisnika as idTipaKorisnika,jezik,email from korisnik"

							db.all(upit2, function (err, row)
							{

								if (err)
								{
									res.json({ success: false, msg: "Neuspesna registracija" });
								}
								else
								{

									var user = { ID: row[0].max, username: username, email: row[0].email, jezik: row[0].jezik, slika: row[0].slika, idTipaKorisnika: row[0].idTipaKorisnika };
									var srpSUbject = "Potvrda naloga na Olimijadi";
									var engSUbject = "Confirm account on Olimijada";

									code = code + "" + username;
									var address = req.body.address + "/validacija?kode=" + code;

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
										<h3>Ovde mozete aktivirati vaš Oliijada nalog:<a href='${address}'>Here</a></h3>
									<br>
									<br>
									</div>`);

									}
									var sql1 = `INSERT into KorisnickiKodovi(IdKorisnika,kod,datumUnosa)
															values (?, ?, julianday('now'))`;

									db.run(sql1, [user.ID, code], function (err)
									{
										if (err)
											res.json({ success: false, sameUser: true, user: user });
										else
											res.json({ success: true, user: user });
									})
								}
							});
						}
					});

				}).catch(function ()
				{
					res.json({ success: false, captchaFail: true });
				});
			}
		});
	})
});



module.exports = router;