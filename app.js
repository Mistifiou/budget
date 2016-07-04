var express = require("express");
var http = require("http");
var pgp = require("pg-promise")();

var db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'stock',
    user: 'postgres',
    password: 'root'
});

var app = express();

//log middleware
app.use(function(request, response, next) {
	console.log("requete vers: " + request.url + " methode: " + request.method);
	next();
});

//static libs
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//routing
app.get("/", function(request, response) {
	response.end("index route");
});
app.get("/api", function(request, response) {
	db.one("select * from produit where id=$1", 3)
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
app.get('/app', function(req, res) {
	res.sendFile('app/index.html', {root: __dirname});
});

//default response middleware
app.use(function(request, response) {
	response.statusCode = 404;
	response.end("Not found");
});

http.createServer(app).listen(3000);