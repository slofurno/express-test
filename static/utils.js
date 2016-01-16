
function mapQueryString(s){
      return s.split('&')
  .map(function(kvp){
        return kvp.split('=');
  }).reduce(function(sum,current){
        var key = current[0];
        var value = decodeURIComponent(current[1]);
        sum[key] = value;
        return sum;
  },{});
}

var qs = mapQueryString(location.search.substr(1));
/*
var options = {
    method,
    url,
    body,
    headers
};
*/

function request (options)
{ 
    var loggedin = localStorage.getItem("account");
    if (!options) return;
	var body = options.body || "";
    var headers = options.headers || {};

	return new Promise((resolve, reject) => {
		var client = new XMLHttpRequest();
		client.onload = function (e) {
			if (client.status !== 200) reject(client.statusText);

			resolve(client.response);
		};
		client.open (options.method, options.url);

        Object.keys(headers).forEach(x => {
            client.setRequestHeader(x, headers[x]);
        });        

        if (loggedin) {
            var account = JSON.parse(loggedin);
            var u = account.account + "." + account.token;
            client.setRequestHeader("Authorization", u);
        }

		client.send (body);
	});
}

