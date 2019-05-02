var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

var bodyParser = require('body-parser');
router.use(bodyParser.json());

/* 
	potrebno je da se na pocetku fajla ucita modul 
	var mail_send=require('putanja');

	i zatim se poziva funkcija send_mail kojoj se salju :
		1.email (ako zelimo da posaljemo onda moraju da se odvoje zarezom 
		npr "user1@gmail.com,user2@gmail.com")
		2.Naslov maila
		3.text koji se salje 
		4.ako ima neki html salje se kao 4 argument kao string

	
*/

module.exports = {
	send_mail: function (email, subject, text, html)
	{
		var our_email = 'olimijada.inception@gmail.com'
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: our_email,
				pass: 'inceptionLMSA'
			}
		});

		var mailOptions = {
			from: our_email,
			to: email,
			subject: subject,
			text: text,
			html: html
		};

		transporter.sendMail(mailOptions, function (error, info)
		{
			if (error)
			{
				return false;
			}
			else
			{
				return true;
			}
		});
	}
}


