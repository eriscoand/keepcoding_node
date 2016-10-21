"use strict";

var express = require('express');
var router = express.Router();

var config = require('../config.json')

//cargar Modelos Mongoose
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var jwt = require('jsonwebtoken');
var sha1 = require('sha1');

//var jwtAuth = require('../lib/jwtAuth');
//router.use(jwtAuth());

//METODO POST LOGIN
router.post('/login', function(req, res, next){

	//recuperar entrada - email, password y idioma
	let email = req.body.email; 
	let clave = sha1(req.body.clave); // clave esta guardada en SHA1 !!

	//Buscar usuario por email *EMAIL es unique!!
	Usuario.findOne({email: email}, function(err,usuario){
		if(err) return next();

		if(!usuario){
			res.json({success:false, error: "EMAIL_NOT_FOUND" });
		}else{
			if(usuario.clave != clave){
				res.json({success:false, error: "INCORRECT_PASSWORD" });
			}else{
				let token = jwt.sign({id: usuario},config.jwt.secret,{expiresIn: '2 days'});				
				res.json({success: true, token: token})
			}
		}
	});

});

//METODO POST CREAR USUARIO
router.post('/', function(req,res,next){

	//Crear usuario a partir de la entrada del body
	var usuario = new Usuario(req.body);

	//encriptamos la clave a SHA1 
	usuario.clave = sha1(usuario.clave);

	//guardar usuario en la base de datos
	usuario.save(function(err,usuario){
		if(err) return next(err);

		//Si el usuario se ha creado correctamente creo el token y se lo devuelvo al usuario para
		//que pueda empezar a usar la api
		let token = jwt.sign({id: usuario},config.jwt.secret,{expiresIn: '2 days'});				
		res.json({success: true, token: token})

	});

});

module.exports = router;
