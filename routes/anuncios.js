"use strict";

var express = require('express');
var router = express.Router();

var config = require('../config.json')

//cargar Modelos Mongoose
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

var jwtAuth = require('../lib/jwtAuth');
router.use(jwtAuth());

//METODO GET ANUNCIOS
router.get('/', function(req, res, next){

	//recuperar datos de la query string
	var tags = req.query.tag;

	var venta = req.query.venta;

	var lte = req.query.lte;
	var gte = req.query.gte;

	var sort = req.query.sort || null;
	var limit = parseInt(req.query.limit) || null;
	var skip = parseInt(req.query.skip) || 0;
  	var fields = req.query.fields || null;

	//crear filtro
	var filter = {};
	//Si el querystring contiene la variable venta agregar al filtro y comprobar que sea true o false
	if(typeof venta !== 'undefined' && (venta == 'true' || venta == 'false')) {
		filter.venta = venta;
	}

	//Si el querystring contiene las variable lte (lower than or equal) y gte (greater than or equal)
	if(typeof lte !== 'undefined' && typeof gte !== 'undefined') {
		//si contiene las dos variables agregarlas al filtro
		filter.precio = { $lte: lte, $gte: gte };
	}else if(typeof lte === 'undefined' && typeof gte !== 'undefined'){
		//de otro modo si solo contiene gte agregarlo al filtro
		filter.precio = { $gte: gte };
	}else if(typeof lte !== 'undefined' && typeof gte === 'undefined'){
		//de otro modo si solo contiene lte agregarlo al filtro
		filter.precio = { $lte: lte };
	}

	//Si el querystring contiene la variable tag
	if(typeof tags !== 'undefined'){
		//En este caso, he contemplado que se pueda entrar solo un tag o varios.
		if(typeof tags == 'string'){
			//En el caso de que solo se entre un tag, se crea una lista a partir de el y creamos el filtro con $in
			var tagList = [];
			tagList.push(tags);
			filter.tags = { "$in" : tagList }
		}else{
			//En el caso de que se entren varios tags, le damos a $in todo los valores
			filter.tags = { "$in" : tags }
		}
	}

	//Buscamos los resultados con todos los parametros de entrada creando la query
    var query = Anuncio.find(filter);
    query.sort(sort);
    query.limit(limit);
    query.skip(skip);

    //En el caso de que se quiera hacer un select de mas de un campo se requiere una transformación a string separados
    //por espacios 
    if(fields != null){
    	fields = fields.toString().replace(","," ");
    }
    query.select(fields);

    query.exec(function(err, anuncios) {
		if(err) return next(err); // return si hay algun error

		//Si todo ha ido bien. También devolvemos la carpeta donde estan las imagenes :)
		res.json({success:true, images_folder: config.images_folder, anuncios: anuncios});
    });

});

module.exports = router;
