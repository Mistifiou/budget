/**
 * Imports
 */
var express = require("express");
var http = require("http");
var pgp = require("pg-promise")();
var bodyParser = require('body-parser');

/**
 * Config DB
 */
var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'budget',
    user: 'postgres',
    password: 'julien'
});

/**
 * App init
 */
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
	db.one("SELECT * FROM type WHERE id=$1;", 1)
    .then(function (data) {
		response.send(data);
    })
    .catch(function (error) {
        response.send(error);
    });
});

app.get("/budget/:date", function(request, response) {
	db.any("SELECT * FROM ligne_budget WHERE date=$1;", request.params.date)
    .then(function (data) {
		response.send(data);
    })
    .catch(function (error) {
        response.send(error);
    });
});

app.get("/budget_lignes/type/:type", function(request, response) {
	db.any("SELECT type, intitule, valeur FROM ligne_budget WHERE type=$1 GROUP BY intitule, type, valeur;", request.params.type)
    .then(function (data) {
		response.send(data);
    })
    .catch(function (error) {
        response.send(error);
    });
});

app.post("/budget_lignes/add", function(request, response) {	
	var ligne = request.body;
	console.log("insert : " + ligne);
	db.one("INSERT INTO public.ligne_budget(date, type, intitule, valeur) VALUES ($1, $2, $3, $4) RETURNING id;", 
			[ligne.date, ligne.type, ligne.intitule, ligne.valeur])
    .then(function (data) {
    	console.log("ok with data : " + data);
		response.send(data);
    })
    .catch(function (error) {
    	console.log("ko with data : " + error);
        response.send(error);
    });
});

app.post("/budget_lignes/rm", function(request, response) {	
	console.log(request.body);
	var ligne = request.body;
	console.log("delete : " + ligne.id);
	db.none("DELETE FROM ligne_budget WHERE id=$1;", 
			[ligne.id])
    .then(function (data) {
    	console.log("ok with data : " + data);
		response.send(data);
    })
    .catch(function (error) {
    	console.log("ko with data : " + error);
        response.send(error);
    });
});

app.post("/budget_lignes/alter", function(request, response) {	
	var ligne = request.body;
	console.log("alter : " + ligne.id);
	db.none("UPDATE public.ligne_budget SET intitule=$1, valeur=$2 WHERE id=$3;", 
			[ligne.intitule, ligne.valeur, ligne.id])
    .then(function (data) {
    	console.log("ok with data : " + data);
		response.send(data);
    })
    .catch(function (error) {
    	console.log("ko with data : " + error);
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