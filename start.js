"use strict";
var express = require('express');
var app = express();

var apiHandler = require('./apiHandler');
var accountHandler = require('./accountHandler');

app.set('views', './views')
app.set('view engine', 'ejs');

app.use(function readBody (req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.body = data;
        next();
    });
});
/*
app.get('/', function(req, res) {  
	res.render('layout', {page: 'index'}); 
});

app.get('/ads', function(req, res) {  
	res.render('layout', {page: 'ads'}); 
});

app.get('/login', function(req, res) {  
	res.render('layout', {page: 'login'}); 
});

app.get('/reset', function(req, res) {  
	res.render('layout', {page: 'reset'}); 
});
*/

app.use('/api', apiHandler);
app.use('/account', accountHandler);

app.use(function errorHandler (err, req, res, next) {
    console.log("catching error for the app");
	console.log("error:", err);
	res.sendStatus(401);
});

app.use(express.static('static'));

var server = app.listen(3001);

