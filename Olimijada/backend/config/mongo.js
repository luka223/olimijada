var mongo = require('mongoose');


mongo.connect("mongodb://inception:Incept!0N@147.91.204.116:11039/OlimijadaNerelaciona");
mongo.connection.on('connected', function ()
{
	console.log("Connected to database " + "147.91.204.116:11039/OlimijadaNerelaciona");
});

mongo.connection.on('error', function (err)
{
	console.log("Error: " + err);
});

module.exports = mongo;