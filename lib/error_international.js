'use strict';

var config = require('../config.json')

module.exports = function() {

    return function(req, res, next) {

        // leer la cabezera, parametros url o los parametros post buscando el idioma de entrada
        // sino hay ninguno siempre vamos a tener el del config.json
        var lang = req.body.lang || req.query.lang || req.headers['x-lang'] || config.lang;

        // comprobamos si lang existe
        if (lang) {
            //creo el parametro lang cargando el contenido del fichero de traducciones para poder acceder a posterior
            req.lang_e = require('../translate/inter_'+lang+'.json');
            next();
        } else {
            //En caso de que no exista lang devolvemos un error 500 
            return res.status(500).json({
                error: { code: 500, message: require('../translate/inter_en.json').NO_TRANSLATION}
            });

        }
    };
};