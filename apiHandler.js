"use strict";
var express = require('express');
var router = express.Router();
var db = require('./db');
var querystring = require('querystring');
var crypto = require('crypto');

var secret = "E09TIFZp38XvuZR8V0bkUQyTITTX4DWuQMGuRnPaG9Q=";
var _secret = "poiugvfbwery9348b7590bc1024c5612rn347rb2sdhczxh912c4bcvmxcvjksrhjo230";



router.get('/api/ads', (req, res) => {
    return db.getAds()
        .then(print => {
            res.json(print);
        })
        .catch(console.error);
});

router.post('/api/account', (req, res) => {
    console.log(req.body);
    var account = JSON.parse(req.body);
    return db.createAccount(account)
        .then(id => {
            res.json(id);
        })
        .catch(err => {
            console.error(err);
        });
});

router.post('/api/login', (req, res) => {
    var login = JSON.parse(req.body);

    return db.getAccount(login.email)
    .then(account => {
        var hashed = hash(login.password + account.salt);

        if (hashed === account.password) {
            return {
                id: account.id,
                email: account.email
            };
        } else {
            return Promise.reject("login failed");
        }
    })
    .then(a => {
        res.json(a);
    })
    .catch(err => {
        res.sendStatus(401);
    });

});

router.post('/api/forgot', (req, res) => {
    var body = JSON.parse(req.body);
    res.send(passwordReset(body.email));
});

router.post('/api/reset', (req, res) => {
    var body = JSON.parse(req.body);
    console.log(body);
    var content = {
        email: body.email,
        expire: body.expire
    };

    console.log(JSON.stringify(content));
    var hashed = hash(JSON.stringify(content));
    console.log("hashed:", hashed);
    if (hashed !== body.hash) {
        console.log("bad hash");
        return;
    }

    var now = Date.now();

    if (now > body.expire) {
        console.log("reset code expired");
        return;
    }

    return db.updateAccount(body)
        .then(x => {
            res.json("ok");
        })
        .catch(err => {
            console.error(err);
        });

});

function passwordReset (email)
{
    var expire = Date.now() + (1000 * 60 * 15);
    var content = {
        email: email,
        expire: expire
    };    

    console.log(JSON.stringify(content));
    var hashed = hash(JSON.stringify(content));

    console.log("hash:", hashed);
    content.hash = hashed;

    var qs = querystring.stringify(content);
    return qs;
}
