const jwt = require('jsonwebtoken');

module.exports = function (req, res, next)
{
	var bearer = req.header('AuthorizationAdmin');

	if (bearer == undefined)
		res.status(401).send('admin');
	else
	{
		let token = bearer.split(" ")[1];
		let dec = jwt.decode(token);

		jwt.verify(token, 'poverljivo', function (err, decoded)
		{
			if (err)
				res.status(401).send('admin');
			else
			{
				var user = jwt.decode(token).user;
				if (user.idTipaKorisnika == 1 || user.idTipaKorisnika == 0)
				{
					var noviToken = jwt.sign({ user }, "poverljivo", { expiresIn: "1h" });
					res.header('TokenAdmin', 'Bearer ' + noviToken);
					next();
				}
				else
					res.status(401).send('admin');
			}
		});
	}
}