"use strict";

var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var usuario = new Schema({

	nombre			: { type: String, required: true },
	email			: { type: String, required: true, index: true },
	clave			: { type: String },
	creacion		: { type: Date, default: Date.now }

});
 
mongoose.model( 'Usuario', usuario );