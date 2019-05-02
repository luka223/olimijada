var sqlite3=require('sqlite3').verbose();



var putanja=__dirname;
var n = putanja.replace("config", "OlimijadaRelaciona.db");
module.exports=new sqlite3.Database(n);
