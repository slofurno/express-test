"use strict";
var express = require('express');
var db = require('./db');
var querystring = require('querystring');
var crypto = require('crypto');

var secret = "E09TIFZp38XvuZR8V0bkUQyTITTX4DWuQMGuRnPaG9Q=";
var _secret = "poiugvfbwery9348b7590bc1024c5612rn347rb2sdhczxh912c4bcvmxcvjksrhjo230";

var apiHandler = require('./api');
var accountHandler = require('./accountHandler');
var app = express();

app.set('views', './views')
app.set('view engine', 'ejs');

db.db.exec(`
        PRAGMA synchronous = OFF; 
        PRAGMA journal_mode = MEMORY; 
        PRAGMA page_size=4096; 
        PRAGMA mmap_size=4294967296; 
        PRAGMA temp_store=MEMORY;
        `);


db.stats.exec(`
        PRAGMA synchronous = OFF; 
        PRAGMA journal_mode = MEMORY; 
        PRAGMA page_size=4096; 
        PRAGMA mmap_size=4294967296; 
        PRAGMA temp_store=MEMORY;
        `);

app.use(function(req, res, next) {
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

function randomBase64 (n)
{
    return new Promise((res, rej) => {
        crypto.randomBytes(n, (err, buf) => {
            if (err) rej(err);
            res(buf.toString('base64'));
        });
    });
}

function fakeuuid ()
{
    return crypto.randomBytes(32).toString('base64');
}


app.get('/', function(req, res) {  
	res.render('index'); 
});

app.get('/ads', function(req, res) {  
	res.render('ads'); 
});

app.get('/login', function(req, res) {  
	res.render('login'); 
});

app.get('/api/users', (req, res) => {
	return db.select().then(rows => {
		res.send(JSON.stringify(rows));
	});
});

app.post('/api/users', (req, res) => {

	var body = querystring.parse(req.body);
    console.log(body);

    return; 
    var email = req.query.email;

    var makeUser = () => {
        return randomBase64(32).then(id => {
            return {id:id, email:email};
        });
    };

    var makeLogin = (user) => {
        return randomBase64(32)
           .then(token => {
                return {userid: user.id, token:token};
           });
    };

    return makeUser()
        .then(insertUser)
        .then(makeLogin)
        .then(insertLogin)
        .then(login => {
            res.send(JSON.stringify(login));
        })
        .catch(console.error);
     
});

var ads = [];
var users = [];

var SEX = {};
SEX.MALE = 1 << 1;
SEX.FEMALE = 1 << 2;

/*
Promise.all([db.getAds(), db.getUsers()])
    .then(a => {
        var ads = a[0];
        var users = a[1];
        var mydb = db.stats;

        var j = 0;

        mydb.serialize(function() {
            mydb.exec("BEGIN");
            //var s = mydb.prepare("insert into prints VALUES (?,?)");
            var s = mydb.prepare("insert into prints VALUES (?,?,?,?)");
            
            ads.forEach(ad => {

                for (var i = 0; i < 10000; i++){
                    j++;
                    j = j % users.length;
                    var user = users[j];
                    //s.run(user.id, ad.id);
                    s.run(ad.id, user.sex, user.state, Date.now());
                }  
                console.log("added for ad:", ad.id);
            });

            s.finalize();
            mydb.exec("COMMIT");
            console.log("done?");
        });
    })
    .catch(console.error);
*/

/*
for (var i = 220; i < 400; i++) {
    ads.push({id:fakeuuid(), name: "ad " + i});
}

db.db.exec("BEGIN");
ads.forEach(x => {
    db.insertAd(x);
    console.log(`inserted ad ${x.id}`);
});

db.db.exec("COMMIT");

*/

/*
var states = "ALAKAZARCOCTDEGAHIIDILINIAKSKYLAMDMEMINJNMNCNDOHOKRISCSD".match(/[A-Z]{2}/g);

for (var i = 160000; i < 300000; i++) {

    var sex = (i % 2 == 0) ? SEX.MALE : SEX.FEMALE; 
    var r = i % states.length;
    var state = states[r];

    users.push({id:fakeuuid(), email: "user"+i+"@gmail.com", state:state, sex:sex});
}

    db.db.exec("BEGIN");
    var s = db.db.prepare("insert into users VALUES (?,?,?,?)");
    users.forEach(user => {
        s.run([user.id, user.email, user.sex, user.state]);
    });
    s.finalize();
    db.db.exec("COMMIT");
    */
/*

db.db.serialize(() => {

    db.db.exec("BEGIN");

    var s = db.db.prepare("insert into users VALUES (?,?,?,?)");
    users.forEach(user => {
        s.run([user.id, user.email, user.sex, user.state]);
    });
    s.finalize();

    var j = 0; 

    var s1 = db.db.prepare("insert into prints VALUES (?,?)");

    ads.forEach(ad => {
        for (var i = 0; i < 100000; i++){
            j++;
            j = j % users.length;
            var user = users[j];

            s1.run([user.id, ad.id]);
            //db.insertPrint({UserId:user.id, AdId: ad.id});
        }  
    });
    s1.finalize();

    db.db.exec("COMMIT");
});
*/

app.use('/api', apiHandler);
app.use('/account', accountHandler);

app.use(function (err, req, res, next) {
    console.log("catching error for the app");
	console.log("error:", err);
	res.sendStatus(401);
});

app.use(express.static('static'));


var server = app.listen(3001);

