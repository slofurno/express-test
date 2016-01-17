function authService ($http)
{
    var auth = {
        login, 
		logout,
        getAds,
        postAd
    };

	console.log("running account service");
    var loggedin = localStorage.getItem("account");

    if (loggedin) {
        auth.account = JSON.parse(loggedin);
        console.log("logged in as", auth.account);
    }

    function authedRequest (options) 
	{
        if (auth.account) {
            if (!auth.account.id || !auth.account.token) {
                throw new Error("id and token should not be undefined if account");
            }
            var u = auth.account.id + "." + auth.account.token;
            options.headers = {
                Authorization: u 
            };
        }
        return $http(options);
    }

    function login (login) 
    {
        return $http({method:"POST", url:"/account/login", data:login})
            .then(res => {
                var acc = res.data;
				acc.email = login.email;

                auth.account = acc;
                localStorage.setItem("account", JSON.stringify(acc));
                console.log("logged in as", auth.account);
                return acc;
            });
    }

    function getAds () 
    {
        return authedRequest({
            url: "/api/ads",
            method: "GET"
        });
    }

    function postAd (ad) 
    {
        return authedRequest({
            url: "/api/ads",
            method: "POST",
            data: ad
        });
    }

	function logout () 
    {
		localStorage.removeItem("account");
        delete auth.account;
	}

    return auth;
}

module.exports = authService;

