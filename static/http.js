"use strict";

module.exports = function ()
{		
	var request = function (method, url, body)
	{
		body = body || "";
		return new Promise((resolve, reject) => {
			var client = new XMLHttpRequest();
            client.onload = function (e) {
                if (client.status !== 200) reject(client.statusText);

                resolve(client.response);
            };
            client.open (method, url);
            client.send (body);
		});
	};
    return {request};
};
