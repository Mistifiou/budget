/**
 * Imports
 */
var express = require("express");
var http = require("http");
var pgp = require("pg-promise")();

/**
 * Config DB
 */
var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'budget',
    user: 'postgres',
    password: 'root'
});

/**
 * App init
 */
var app = express();

/**
 * Middleware pour log de requêtes
 * pas nécessaire
 */
app.use(function(request, response, next) {
	console.log("requete vers: " + request.url + " methode: " + request.method);
	next();
});

/**
 * Déclaration des librairies statiques pour l'IHM
 */
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

/**
 * Routing pour l'API
 */
app.get("/", function(request, response) {
	response.end("index route");
});
app.get("/api", function(request, response) {
	db.one("select * from type where id=$1", 1)
    .then(function (data) {
		response.send(data);
    })
    .catch(function (error) {
        response.send(error);
    });
});
app.get("/api/params/:param", function(request, response) {
	response.end("params route: " + request.params.param);
});

/**
 * Routing de base pour l'appli IHM
 */
app.get('/app', function(req, res) {
	res.sendFile('app/index.html', {root: __dirname});
});

/**
 * Default response middleware
*/
app.use(function(request, response) {
	response.statusCode = 404;
	response.end("Not found");
});

/**
 * Initialisation du serveur
 */
http.createServer(app).listen(3000);