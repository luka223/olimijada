var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('OlimijadaRelaciona.db');
//var db = require('../config/database'); //dodavanje konekcije sa bazon
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var sha1 = require('sha1');
var jwt = require('jsonwebtoken');
var  mail_send=require('../mail_send');
router.use(bodyParser.json());

/* GET users listing. */



router.post('/', function (req, res, next)
{

	var username = req.body.username;
	var password = req.body.password;

	db.serialize(function ()
	{

		db.all("select * from korisnik where username = ?", [username], function (err, row)
		{
			if (err)
				res.send("greska sa bazom");
			else
			{
				if (row.length == 0)
				{
					res.json({ success: false, msg: "BAD_USERNAME_PASSWORD" })
					
				}
				else
				{
					if (bcrypt.compareSync(password, row[0].password) == true)	
					{
						var user = { ID: row[0].ID, username: row[0].username, email: row[0].email, jezik: row[0].jezik, slika: row[0].slika,idTipaKorisnika:row[0].idTipaKorisnika,potvrdjen:row[0].potvrdjen};
						
						var token = jwt.sign({ user }, "poverljivo", { expiresIn: "1d" });

						res.json({ success: true, msg: "Uspesno logovanje", user: user, token: "Bearer " + token });
					}
					else {
						res.json({ success: false, msg: "BAD_USERNAME_PASSWORD" })
					}
				}
			}


		});





	});

});



module.exports = router;