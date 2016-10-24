# Práctica NODE.js + MongoDB + Express.js

###1. Documentación API

La raiz de la API es http://ipservidor:puerto/apiv1. "apiv1" es configurable en la variable "api_url" del config.json.

La API puede acceder a **usuarios** y a **anuncios**.

####1.1 Internalización

Todos los métodos de la API devuelven los mensajes de error traducidos a los idiomas que se encuentren creados. En caso de pedir un idioma no creado devolverá un error. Por defecto el idioma es el español. Esto se puede configurar en el config.json.
El usuario si lo desea puede enviar el idioma en el cual quiere recibir los errores. Este paramétro se puede enviar como parametro get con el nombre lang, como parte del body con el nombre lang o incluso como un header con el nombre "x-lang".

####1.2 Errores

Todas las acciones, en caso de devolver un error, este se devolverá como sigue:

{message: "Mensaje de error", details:{}}

En "message" se podrá encontrar el mensaje de error devuelto en el idioma configurado o por petición. En details se podrá encontrar más información técnica.

####1.3 Usuarios

**POST: /** 

Este método **POST** requiere del nombre, del email y de una clave para intentar la creación del usuario. En caso afirmativo devuelve el token del usuario con validez de 2 dias (se puede configurar en el config.json) para empezar a trabajar con la API. **Nombre y email son obligatorios**
	
Request(x-www-form-urlencoded): body: **nombre** - **email** - **clave**

Response(JSON): {success: true, token: token_usuario}

**POST: /login** 

Este método **POST** requiere del email y del password en un form-urlencoded con esos nombres para intentar el login en la aplicación. En caso afirmativo devuelve el token del usuario con validez de 2 dias (se puede configurar en el config.json) para empezar a trabajar con la API.
	
Request(x-www-form-urlencoded): body: **email** - **password**

Response(JSON): {success: true, token: token_usuario}

####1.4 Anuncios



	
