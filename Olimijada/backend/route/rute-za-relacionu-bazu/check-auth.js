const jwt = require('jsonwebtoken');

module.exports = function (req, res, next)
{
	var bearer = req.header('Authorization');

	if (bearer == undefined)
		res.status(401).send('user');
	else
	{
		let token = bearer.split(" ")[1]; // uzimanje tokena (prva rec je Bearer)

		// verifikacija tokena (da li je dobar secret key i da li je token istekao)
		jwt.verify(token, 'poverljivo', function (err, decoded)
		{
			// ukoliko je istekao ili nije dobar secret key, vraca status 401
			if (err)
				res.status(401).send('user');
			else
			{
				// ukoliko je sve dobro, izvlaci korisnika i pravi novi token
				var user = jwt.decode(token).user;
				var noviToken = jwt.sign({ user }, "poverljivo", { expiresIn: "1d" });

				// dodavanja novog tokena u header
				res.header('Token', 'Bearer ' + noviToken);

				// prelazak na izvrsavanja rute, posto su sve provere prosle dobro
				next();
			}
		});
	}
}