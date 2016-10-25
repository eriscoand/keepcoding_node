'use strict';

var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
 
var anuncio = new Schema({

	nombre			: { type: String, required: true, index: true },
	venta			: { type: Boolean, default: false, index: true },
	precio			: { type: Number, default: 0 },
	foto			: { type: String, default: 'default.jpg' },
	tags			: [{ type: String }]

});
 
mongoose.model( 'Anuncio', anuncio );