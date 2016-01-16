function accountService (httpService)
{
	console.log("running account service");
    var loggedin = localStorage.getItem("account");
    var account = {};

    if (loggedin) {
        account = JSON.parse(loggedin);

        //account.id = p.id;
        //account.token = p.token;
    }

	console.log("logged in as", account);

    var authedRequest = function (options) {
        if (account.id && account.token) {
            var u = account.id + "." + account.token;
            options.headers = {
                Authorization: u 
            };
        }
        return httpService.request(options);
    };

    var login = function (login) {
        var body = JSON.stringify(login);
        return httpService.request({method:"POST", url:"/account/login",body:body})
            .then(a => {
                var acc = JSON.parse(a);
				acc.email = login.email;

				account.id = acc.id;
				account.token = acc.token;
				account.email = acc.email;
                localStorage.setItem("account", JSON.stringify(acc));
                return acc;
            });
    };

    var getAds = function () {
        return authedRequest({
            url: "/api/ads",
            method: "GET"
        });
    };

    var postAd = function (ad) {
        return authedRequest({
            url: "/api/ads",
            method: "POST",
            body: JSON.stringify(ad)
        });
    };

	var logout = function() {
		localStorage.removeItem("account");
		account.id = undefined;
		account.token = undefined;
		account.email = undefined;
	};

    return {
        login, 
		logout,
        account, 
        getAds,
        postAd
    }
}

module.exports = accountService;

