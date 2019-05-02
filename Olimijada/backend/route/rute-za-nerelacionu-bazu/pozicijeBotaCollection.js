var mongo = require('../../config/mongo').mongoose;

var kordinate=mongo.Schema({

	x:{
		type:Number,
		required:true
	},
	y:{
		type:Number,
		required:true
	},
	vremePoteza:{
		type:Number,
		required:true
	}

})

var pozicijeBotaSchema=mongo.Schema({
	idBota:{
		type:Number,
		required:true,
	},
	idUtakmice:{
		type:Number,
		required:true,
	},
	idTima:{
		type:Number,
		required:true,
	},
	pozicije:{
		type:[{

			x:{
				type:Number,
				required:true
			},
			y:{
				type:Number,
				required:true
			},
			vremePoteza:{
				type:Number,
				required:true
			}
		
		}],
		required:true
	}
})



const pozicijeBota=module.exports=mongo.model("pozicijeBota",pozicijeBotaSchema);



module.exports.dodajPozicijeBota=function(pozicije,callback){
	pozicije.save(callback);
}

module.exports.dajPozicijeBotaUmecu=function (idUtakmice,callback)
{
    pozicijeBota.find({idUtakmice:idUtakmice},callback).sort({idBota:'asc'});
}