var m = require('mithril');
var request = require('superagent');

var home = {
    controller: function() {
        return {greeting: "Hello"}
    },
    view: function(ctrl) {
        return m("h1", ctrl.greeting)
    }
};


var login = {
    controller: function() {
        return {greeting: "login"}
    },
    view: function(ctrl) {
        return m("h1", ctrl.greeting)
    }
};

var sponser = {
    controller: function() {
        return {greeting: "ponser"}
    },
    view: function(ctrl) {
        return m("h1", ctrl.greeting)
    }
};


var user = {
    controller: function() {
        return {greeting: "user"}
    },
    view: function(ctrl) {
        return m("h1", ctrl.greeting)
    }
};

m.route.mode = "hash";

/*
m.route(document.body, "/", {
    "/": home,
    "/login": login,
    "/sponser": sponser,
    "/user": user
});
*/

var submit = document.getElementById("submit");
var advertiser = document.getElementById("advertiser");
var email = document.getElementById("email");



submit.onclick = function ()
{

    request.get('/api/ads')
        .end(function(err, res) {
            var ads = res.body;
            getAllStats(ads);
        });
    //var user = {email: email.value, sponser: advertiser.checked};
    //var post = client.request("POST", "/api/users", JSON.stringify(user));
};

function getAllStats (ads)
{
    ads.forEach(ad => {
        request.get('/api/prints')
            .query({ad:ad.id})
            .end(function(err, res) {
                if (!err) {
                    res.body.forEach(x => {
                        console.log(x);  
                    });
                }
            });
    }); 
}
