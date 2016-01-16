
var express = require('express');
var db = require('./db');
var querystring = require('querystring');
var crypto = require('crypto');

var secret = "E09TIFZp38XvuZR8V0bkUQyTITTX4DWuQMGuRnPaG9Q=";
var _secret = "poiugvfbwery9348b7590bc1024c5612rn347rb2sdhczxh912c4bcvmxcvjksrhjo230";

var router = express.Router();

function hash (n)
{
    const hmac = crypto.createHmac('sha256', _secret);
    hmac.update(n);
    return hmac.digest("base64");
}

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

router.post('/signup', (req, res, next) => {
    console.log(req.body);
    var account = JSON.parse(req.body);
    account.address = req.ip;

    return db.createAccount(account)
        .then(db.createLogin)
        .then(login => {
            return res.json(login);
        })
        .catch(next);
});

router.post('/login', (req, res, next) => {
    var login = JSON.parse(req.body);
    console.log("logging in as:", login);

    console.log("ip:", req.ip);

    return db.getAccount(login.email)
    .then(account => {
        var hashed = hash(login.password + account.salt);

        if (hashed === account.password) {
            return {
                id: account.id,
                email: account.email,
                address: req.ip
            };
        } else {
            return Promise.reject("login failed");
        }
    })
    .then(db.createLogin)
    .then(login => {
        return res.json(login);
    })
    .catch(next);

});

router.post('/forgot', (req, res) => {
    var body = JSON.parse(req.body);
    res.send(passwordReset(body.email));
});

router.post('/reset', (req, res) => {
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

module.exports = router;
