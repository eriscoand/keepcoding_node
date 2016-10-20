"use strict";

var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var jwtAuth = require('../lib/jwtAuth');

router.use(jwtAuth());

router.post('/login', function(req, res, next){

	let user = req.body.user;
	let pass = req.body.pass;

	//TODO get user and password

	var userRecord = { id : 44, name: 'javi' }

	let jwt = jwt.sign({id: userRecord},'clau',{expiresIn: '2 days'});

	res.json({success: true, token: jwt})

});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
