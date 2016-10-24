# Práctica NODE.js + MongoDB + Express.js

##1. Documentación API


La raiz de la API es https://ipservidor:puerto/apiv1. "apiv1" es configurable en la variable "api_url" del config.json.

El comando "npm start" esta configurado para que el servidor arranque con SSL. **Todas las peticiones requeriran HTTPS**. En caso de no querer SSL modificar el comando en el package.json. 

La API puede acceder a **usuarios** y a **anuncios**.

Todas las responses de esta API son del tipo JSON, ya sean errores o no.

##1.1 Internalización

Todos los métodos de la API devuelven los mensajes de error traducidos a los idiomas que se encuentren creados. En caso de pedir un idioma no creado devolverá un error. Por defecto el idioma es el español. Esto se puede configurar en el config.json.
El usuario si lo desea puede enviar el idioma en el cual quiere recibir los errores. Este paramétro se puede enviar como parametro get con el nombre lang, como parte del body con el nombre lang o incluso como un header con el nombre "x-lang".

##1.2 Errores

Todas las acciones, en caso de devolver un error, este se devolverá como sigue:

message, details:{Object}

En "message" se podrá encontrar el mensaje de error devuelto en el idioma configurado o por petición. En details se podrá encontrar más información técnica.

##1.3 Usuarios

###**POST: /apiv1/users/** 

>Este método **POST** requiere del nombre, del email y de una clave para intentar la creación del usuario. En caso afirmativo devuelve el token del usuario con validez de 2 dias (se puede configurar en el config.json) para empezar a trabajar con la API. **Nombre y email son obligatorios**
	
Request(x-www-form-urlencoded): body: **nombre** - **email** - **clave**

Response(JSON): success, token

###**POST: /apiv1/login** 

>Este método **POST** requiere del email y del password en un form-urlencoded con esos nombres para intentar el login en la aplicación. En caso afirmativo devuelve el token del usuario con validez de 2 dias (se puede configurar en el config.json) para empezar a trabajar con la API.
	
**Request(x-www-form-urlencoded):** body: **email** - **password**

**Response(JSON):** success, token

>####USAR EL TOKEN

>Todas las peticiones que requieran de autentificación se tendrá que proporcionar un token válido a la API. 
Este paramétro se puede enviar como parametro get con el nombre token, como parte del body con el nombre token o incluso como un header con el nombre "x-access-token".

##1.4 Anuncios

>Todos los métodos de esta ruta requieren de autentificación. Antes de empezar a trabajar se tiene que obtener un token válido de un usuario registrado *(mirar info de la ruta Usuarios)*

###**GET: /apiv1/anuncios/** 

>Este método GET devuelve por defecto todos los anuncios de la base de datos. Los siguientes parámetros GET permiten crear filtros y hacer mas selecciones:

*Nota: Estos parámetros se pueden usar solos o en conjunto.*

**Request params:**

* **nombre**: crea un filtro con la propiedad nombre. Se devolverán todos los que empiezen por el valor entrado.
* **venta**: Solo acepta los valores "true" o "false" y crea un filtro por los anuncios a la venta (true) o no (false)
* **lte**: siglas de "lower than or equal". Crea un filtro que devuelve todos los anuncios con precio inferior al valor entrado. Con el parámetro "gte" se puede crear un rango de precio.
* **gte**: siglas de "greater than or equal". Crea un filtro que devuelve todos los anuncios con precio superior al valor entrado. Con el parámetro "lte" se puede crear un rango de precio.
* **tag**: se puede entrar mas de un valor. Por cada uno entrado crea una lista. Con esta lista se crea un filtro que devolverá todos los anuncios que contengan al menos un valor que este en esta.
* **sort**: este parametro permite que el resultado venga ordenado por el parametro que se especifique. (ej: sort:precio). Por defecto mostrará de forma ascendente. Para mostrar de forma descendente (sort:-precio)
* **limit**: este parametro permite limitar la cantidad de registros de salida. Valor numerico!
* **skip**:este parametro permite saltar-se los primeros registros de la salida a partir del valor de entrada. Valor numerico!
* **fields**:permite más de una entrada. Seleccionará solo los paramétros de los anuncios que se marquen en este.

**Response(JSON):** success, images_folder, anuncios

>*Nota: images_folder es la url de la carpeta donde se encuentran las imagenes. Se puede configurar en el config.json*

###**GET: /apiv1/anuncios/tags** 

Este método GET devuelve todos los tags activos en todos los anuncios de la base de datos. No hay registros repetidos.

Response(JSON): success, tags

###**POST: /apiv1/anuncios/** 

>Este método **POST** requiere del nombre, de si esta en venta o no (true o false), del precio, de una foto, y de una lista de tags para crear el anuncio. En caso afirmativo devuelve el anuncio creado
**Solo el nombre es obligatorio**, venta por defecto sera false, el precio sera 0, la foto sera "default.jpg" y no tendrá lista de tags.
	
**Request(x-www-form-urlencoded):** body: **nombre** - **venta** - **precio** - **foto** - **tags**

**Response(JSON):** success, anuncio

###**PUT: /apiv1/anuncios/:id** 

*Nota: se requiere el id como parámetro GET para poder encontrar el anuncio*

>Este método **PUT** requiere del nombre, de si esta en venta o no (true o false), del precio, de una foto, y de una lista de tags para crear el anuncio. En caso afirmativo si se ha aconseguido modificar el registro devuelve una respuesta.
**Solo el nombre es obligatorio**.
	
**Request(x-www-form-urlencoded):** body: **nombre** - **venta** - **precio** - **foto** - **tags**
URL GET : id

**Response(JSON):** success, response

###**DELETE: /apiv1/anuncios/:id** 

*Nota: se requiere el id como parámetro GET para poder encontrar el anuncio*

>Este método **DELETE** requiere del id para encontrar el anuncio y eliminarlo. En caso afirmativo si se ha aconseguido modificar el registro devuelve una respuesta.
**Solo el nombre es obligatorio**.
	
**Request:** URL GET : id

**Response(JSON):** success, response
