"use strict";
var express = require('express');
var router = express.Router();

var db = require('./db');
var querystring = require('querystring');
var crypto = require('crypto');

var secret = "E09TIFZp38XvuZR8V0bkUQyTITTX4DWuQMGuRnPaG9Q=";
var _secret = "poiugvfbwery9348b7590bc1024c5612rn347rb2sdhczxh912c4bcvmxcvjksrhjo230";


router.use(function authUsers(req, res, next) {
	var path = req.path;
    console.log(req.method);
	var headers = req.headers;
    console.log(headers);
    var auth = headers["authorization"];

    console.log('route requires auth');

    if (!auth){
        throw new Error("not authenticated");
    }

    var parts = auth.split('.');

    if (parts.length !== 2) {
        throw new Error("invalid token");
    }

    var login = {
        account: parts[0],
        token: parts[1]
    };

    return db.checkLogin(login)
        .then(login => {
            console.log("authed as:", login);
            req.auth = login;
            return next();
        })
        .catch(next);
});

router.get('/prints', (req, res) => {
    console.log(req.query);
    var id = req.query.ad;
    id = id.replace(' ','+');
    console.log("getting print stats for id:", id);
    var start = Date.now();

    return db.getStats2(id)
        .then(prints => {
            var end = Date.now();
            console.log("elapsed ms:", end - start);
            console.log("result length", prints.length);
/*
            var male = prints.filter(x => {
                return x.sex == SEX.MALE
            }).length;

            var female = prints.length - male;
            */


            res.json(prints);
            
        })
        .catch(console.error);
});

router.get('/ads', (req, res, next) => {
    var auth = req.auth;

    return db.getAds(auth)
        .then(rows => {
            res.json(rows);
        })
        .catch(next);
});

router.post('/ads', (req, res, next) => {
    var body = JSON.parse(req.body);
    var auth = req.auth;
    console.log("auth is:", auth);

    var ad = {
        AccountId: auth.AccountId,
        name: body.name,
        path: body.path
    };

    return db.createAd(ad)
        .then(row => {
            return res.json(row); 
        })
        .catch(next);
});


module.exports = router;
