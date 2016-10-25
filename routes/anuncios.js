'use strict';

var express = require('express');
var router = express.Router();

var config = require('../config.json');

var forEach = require('async-foreach').forEach;

//cargar Modelos Mongoose
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

var int_error = require('../lib/error_international');
router.use(int_error());

var jwtAuth = require('../lib/jwtAuth');
router.use(jwtAuth());

//METODO GET ANUNCIOS
router.get('/', function(req, res, next){

	//recuperar datos de la query string
	var nombre = req.query.nombre;

	var venta = req.query.venta;

	var lte = req.query.lte;
	var gte = req.query.gte;

	var tags = req.query.tag;

	var sort = req.query.sort || null;
	var limit = parseInt(req.query.limit) || null;
	var skip = parseInt(req.query.skip) || 0;
  	var fields = req.query.fields || null;

	//crear filtro
	var filter = {};

	//si el querystring contiene la variable nombre agregar filtro por nombre empieza por
	if(typeof nombre !== 'undefined' && nombre !== ''){
		//aplicamos al filtre de nombre un RegExp de startwith con el contenido del querystring nombre
		filter.nombre = new RegExp('^'+nombre, 'i');
	}

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
			filter.tags = { '$in' : tagList };
		}else{
			//En el caso de que se entren varios tags, le damos a $in todo los valores
			filter.tags = { '$in' : tags };
		}
	}

    //En el caso de que se quiera hacer un select de mas de un campo se requiere una transformación a string separados
    //por espacios 
    if(fields !== null){
    	fields = fields.toString().replace(',',' ');
    }

	//Buscamos los resultados con todos los parametros de entrada creando la query
    var query = Anuncio.find(filter);
    query.sort(sort);
    query.limit(limit);
    query.skip(skip);
    query.select(fields);

    query.exec(function(err, anuncios) {
		if(err) return next({error: req.lang_e.SELECT_ERROR, detail: err });

		//Si todo ha ido bien. También devolvemos la carpeta donde estan las imagenes :)
		res.json({success:true, images_folder: config.images_folder, anuncios: anuncios});
    });

});


//PETICION GET QUE DEVUELVE TODOS LOS TAGS EXISTENTES
router.get('/tags', function(req, res, next){

	//Obtener todos los anuncios
	var query = Anuncio.find();
	//Selecccionamos solo los tags
	query.select('tags');

	//ejecutamos el query
	query.exec(function (err, anuncios){
		if(err) return next({error: req.lang_e.SELECT_ERROR, detail: err });

		//creamos el array que se devolverá al finalizar el filtrado de tags
		var tags = [];

		//por cada anuncio obtenemos sus tags
		forEach(anuncios, function(anuncio) {
			//mapeamos los tags de cada anuncio 
			anuncio.tags.map(function (tag) { 
				//miramos si no aún no esta incluido en la lista de tags que se devolverá
				if(!tags.toString().includes(tag)){
					//si aún no esta includo lo añadimos a la lista de tags a devolver
					tags.push(tag);
				}
			});
		}, finished);

		//se ejecuta cuando ha acabado el filtado de tags i devuelve el resultado
		function finished(){
			res.json({success:true, tags: tags});
		}

	});

});


//METODO CREACIÓN ANUNCIOS
router.post('/', function(req,res,next){

	var anuncio = new Anuncio(req.body);
	anuncio.save(function(err,anuncio){
		if(err) return next({error: req.lang_e.CREATE_ERROR, detail: err });

		res.json({success:true, anuncio: anuncio});
	});

});


//METODO MODIFICACION ANUNCIOS
router.put('/:id', function(req,res,next){

	var id = req.params.id;
	Anuncio.update({_id: id},req.body,function(err,response){
		if(err) return next({error: req.lang_e.MODIFY_ERROR, detail: err });

		res.json({success:true, response:response});
	});

});

//METODO ELIMINAR ANUNCIOS
router.delete('/:id', function(req,res,next){

	var id = req.params.id;
	Anuncio.remove({_id: id},function(err, response) {
		if(err) return next({error: req.lang_e.DELETE_ERROR, detail: err });
		res.json({success:true, response: response});
	});
	
});

module.exports = router;
