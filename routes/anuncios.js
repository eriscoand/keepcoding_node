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

	//crear filtro
	var filter = {};
	if(typeof venta !== 'undefined') filter.venta = venta;

	if(typeof lte !== 'undefined' && typeof gte !== 'undefined') {
		filter.precio = { $lte: lte, $gte: gte };
	}else if(typeof gte !== 'undefined'){
		filter.precio = { $gte: gte };
	}else if(typeof lte !== 'undefined'){
		filter.precio = { $lte: lte };
	}

	if(typeof tags !== 'undefined'){
		if(typeof tags !== Array){
			console.log(typeof tags);
			var tagList = [];
			tagList.push(tags);
			filter.tags = { "$in" : tagList }
		}else{
			filter.tags = { "$in" : tags }
		}
	}

	console.log(filter);

	Anuncio.find(filter,sort, function(err,anuncios){
		if(err) return next(err);
		res.json({success:true, images_folder: config.images_folder, anuncios: anuncios});
	});

});

module.exports = router;
