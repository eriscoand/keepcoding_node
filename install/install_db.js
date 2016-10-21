"use strict";

//middleware's
var mongoose = require('mongoose');

//cargar modelos y base de datos
require('../lib/mongoConnection');
require('../models/usuario'); 
require('../models/anuncio'); 

//cargar Modelos Mongoose
var Usuario = mongoose.model('Usuario');
var Anuncio = mongoose.model('Anuncio');

//cargar JSONs
var usuarios = require('./usuarios.json');
var anuncios = require('./anuncios.json');

//funcion que elimina los usuarios
function deleteUsuarios(){
	console.log("Eliminando Usuarios...");
	return new Promise(function(resolve, reject){
		Usuario.remove({}, function(err){
			if(err) reject(err);
			resolve();
		});
	});
}

//funcion que elimina los anuncios
function deleteAnuncios(){
	console.log("Eliminando Anuncios...");
	return new Promise(function(resolve, reject){
		Anuncio.remove({}, function(err){
			if(err) reject(err);
			resolve();
		})
	});
}

//funcion que crea los usuarios a partir del JSON
function createUsuarios(){
	console.log("Creando Usuarios...");
	return new Promise(function(resolve, reject){
		Usuario.insertMany(usuarios, function(err){
			if(err) reject(err);
			resolve();
		})
	});
}

//funcion que crea los anuncios a partir del JSON
function createAnuncios(){
	console.log("Creando Anuncios...");
	return new Promise(function(resolve, reject){
		Anuncio.insertMany(anuncios, function(err){
			if(err) reject(err);
			resolve();
		})
	});
}

//Esperar a que la connexión con la base de datos este hecha!!
mongoose.connection.once('open', function(){
	//Ejecutar promesas
	deleteUsuarios()
		.then(deleteAnuncios)
		.then(createUsuarios)
		.then(createAnuncios)
		.then(function(){
			console.log("Perfecto! ya se han creado datos de prueba!!");
		})
		.catch(function(err){
			console.log("Algo ha salido mal... :(")
			console.log(err);
		});
});
