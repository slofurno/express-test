
var sqlite3 = require('sqlite3').verbose();
var crypto = require('crypto');
var _secret = "poiugvfbwery9348b7590bc1024c5612rn347rb2sdhczxh912c4bcvmxcvjksrhjo230";

var uuid = require('node-uuid');
var db = new sqlite3.Database("test.db");
var stats = new sqlite3.Database("stats.db");

db.exec(`
        PRAGMA synchronous = OFF; 
        PRAGMA journal_mode = MEMORY; 
        PRAGMA page_size=4096; 
        PRAGMA mmap_size=4294967296; 
        PRAGMA temp_store=MEMORY;
        `);


stats.exec(`
        PRAGMA synchronous = OFF; 
        PRAGMA journal_mode = MEMORY; 
        PRAGMA page_size=4096; 
        PRAGMA mmap_size=4294967296; 
        PRAGMA temp_store=MEMORY;
        `);

function createUUID ()
{
    return uuid.v4();
}

function hash (n)
{
    const hmac = crypto.createHmac('sha256', _secret);
    hmac.update(n);
    return hmac.digest("base64");
}

function isUndefined (n)
{
    if (typeof(n) === 'undefined') {
        return true;
    }

    return false;
}


function isValidString (n)
{
    if (typeof(n) !== 'string') return false;

    if (n.length < 4) return false;

    return true;
}

function createAccount (account)
{
    if (isUndefined(account)) {
        throw new Error ("account undefined");
    }

    if (isUndefined(account.email)
            || isUndefined(account.password)) {

        throw new Error ("missing required");
    }

    if (!isValidString(account.email) 
            || !isValidString(account.password)) {
   
       throw new Error ("invalid input");     
    }

    var id = createUUID();
    var salt = crypto.randomBytes(32).toString('base64');
    var password = hash(account.password + salt);
    var email = account.email;
    var address = account.address;

    return new Promise((resolve, reject) => {
        db.run("insert into accounts values (?,?,?,?)", [
                id, email, password, salt
        ], err => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id,
                    email,
                    address
                });
            }
        });
    });
}

function createLogin (account)
{
    var token = createUUID();
    var id = account.id;
    var address = account.address;

    return new Promise((resolve, reject) => {
        db.run("insert into logins values (?,?,?)", [
                id, token, address
        ], err => {
            if (err) {
                reject(err);
            } else {
                resolve({id, token});
            }
        });
    });
}

function checkLogin (login)
{
    return new Promise((resolve, reject) => {
        db.get(`select * from logins
                where logins.AccountId=$account
                and logins.token=$token`, {
                    $account:login.account,
                    $token:login.token
                },
                (err, row) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
    });
}

function getLogins (account)
{
    return new Promise((resolve, reject) => {
        db.all(`select * from logins
                where logins.AccountId=$id`, {
                    $id:account.AccountId
                },
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
    });

}

function getAccount (email)
{
    return new Promise((resolve, reject) => {
        db.get(`select * from accounts
                where accounts.email=$email`, {$email:email},
                (err, row) => {

                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
    });
}

function updateAccount (account)
{
    var salt = crypto.randomBytes(32).toString('base64');
    var password = hash(account.password + salt);
    var email = account.email;

    return new Promise((resolve, reject) => {
        db.run(`update accounts
                set password=$password, salt=$salt
                where accounts.email=$email`, {
                    $email: email,
                    $password: password,
                    $salt: salt
                }, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("ok");
                    }
                });
    });
}

function insert ()
{
    return new Promise((res, rej) => {
        db.run("INSERT INTO users VALUES ($email, $password)", {
            $email:"fakeemail@gmail.com",
            $password:"asdf1234;"
        }, res);
    });
}

function insertUser (user)
{
    return new Promise((res, rej) => {
        db.run("INSERT INTO users VALUES ($id, $email, $sex, $state)", {
            $id: user.id,
            $email: user.email,
            $sex: user.sex,
            $state: user.state
        }, () => {
            res(user);
        });
    });
}

function getUsers ()
{
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", 
                function(err, rows){
                    if (err) {
                        reject(err);
                    }else{
                        console.log("rows", rows.length);
                        resolve(rows);
                    }
                });
    });
}


function createAd (ad)
{
    var id = createUUID();

    return new Promise((resolve, reject) => {
        db.run("INSERT INTO ads VALUES (?,?,?,?)", [
            id, ad.AccountId, ad.name, ad.path
        ], (err) => {
            if (err) {
                reject(err)
            } else{
                resolve({
                    id: id,
                    AccountId: ad.AccountId,
                    name: ad.name,
                    path: ad.path    
                });    
            }
        });
    });
}

function insertLogin (login)
{
    return new Promise((res, rej) => {
        db.run("INSERT INTO logins VALUES ($userid, $token)", {
            $userid: login.userid,
            $token: login.email
        }, () => {
            res(login);    
        });
    });
}

function insertPrint (print)
{
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO prints VALUES ($UserId, $AdId)", {
            $UserId: print.UserId,
            $AdId: print.AdId
        }, () => {
            resolve("ok");
        });
    });
}

function getPrints ()
{
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ads
                INNER JOIN    
                (SELECT count() as count, prints.AdId FROM prints
                group by prints.AdId) as prints 
                ON ads.id=prints.AdId
                `,(err, rows) => {
                    if (err) reject(err);
                    if (!err) resolve(rows);
                });
    });
}


function getStats (id)
{
    return new Promise((resolve, reject) => {
            //SELECT users.state, users.sex, user_prints.view_count from 
        db.all(`SELECT users.state, users.sex, sum(user_prints.view_count) as count FROM
                (SELECT count() as view_count, prints.UserId from prints
                WHERE prints.AdId = $adid
                group by prints.UserId) as user_prints
                LEFT JOIN users
                on user_prints.UserId=users.id
                GROUP BY users.state, users.sex
                `, {
                    $adid: id 
                }, (err, rows) => {
                    if (err) {
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                });
    });
}

function getStats3 (id)
{
    return new Promise((resolve, reject) => {
            //SELECT users.state, users.sex, user_prints.view_count from 
        db.all(`SELECT users.*, user_prints.view_count FROM
                (SELECT count() as view_count, prints.UserId from prints
                WHERE prints.AdId = $adid
                group by prints.UserId) as user_prints
                LEFT JOIN users
                on user_prints.UserId=users.id
                `, {
                    $adid: id 
                }, (err, rows) => {
                    if (err) {
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                });
    });
}
function getStats2 (id)
{
    /*
     *
     *
                                */
    return new Promise((resolve, reject) => {
        stats.all(`SELECT count() as count, state, sex FROM prints
                WHERE prints.AdId = $id
                GROUP BY state, sex
                `, {
                    $id: id 
                }, (err, rows) => {
                    if (err) {
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                });
    });
}

function getAds (auth)
{
    return new Promise((res, rej) => {
        db.all(`SELECT * FROM ads
                WHERE ads.AccountId=?`, [
                   auth.AccountId 
                ], function(err, rows){
            if (err) {
                rej(err)
            } else {
                res(rows);
            }
        });
    });
}

function testSqlite ()
{
	insert().then(select).then(rows => {
		console.log(rows);
	}).catch(err => {
		console.log(err);
	});
}

module.exports = {
    insertUser,
    getUsers,
    createAd,
    getStats,
    getStats2,
    insertPrint,
    getPrints,
    db,
    stats,
    getAds,
    createAccount,
    getAccount,
    updateAccount,
    createLogin,
    checkLogin,
    getLogins
};
