
function loginController ($scope, accountService)
{
    $scope.account = {};

    function saveLogin (account)
    {
        console.log("SUCCESS created account:", account);
        localStorage.setItem("account", account);
    }

    $scope.getLogins = function() {

        return request({method:"GET", url:"/api/account"})
        .then(res => {
            var logins = JSON.parse(res);
            logins.forEach(addLoginHistory);
        })
        .catch(err => { console.error(err); });
    };
    
    $scope.login = function() {
        accountService.login($scope.account)
			.then(() => {
				$scope.$apply();
			});
    };
}

module.exports = loginController;

/*
document.getElementById("forgot").onclick = function(e) {
    e.preventDefault();

	var email = document.getElementById("email").value;	
	var password = document.getElementById("password").value;	

	var body = {
        email,
        password
	};

    request({method:"POST", url:"/account/forgot", body:JSON.stringify(body)})
        .then(q => {
            var el = document.createElement("a");    
            var link = "/reset?"+q;
            
            el.href = link;
            el.innerHTML = link;
            el.style.whiteSpace = "nowrap";
            el.style.display = "block";
            content.appendChild(el);
        });

};

document.getElementById("login").onclick = function(e) {
	var email = document.getElementById("email").value;	
	var password = document.getElementById("password").value;	

	var body = {
        email,
        password
	};

	request({method:"POST", url:"/account/login", body:JSON.stringify(body)})
        .then(saveLogin)
        .then(getLogins)
        .catch(err => {
            console.error(err);
        });
};

document.getElementById("create").onclick = function(e) {
	var email = document.getElementById("email").value;	
	var password = document.getElementById("password").value;	
	var content = document.getElementById("content");	

	var body = {
        email,
        password
	};

	request({method:"POST", url:"/account/signup", body:JSON.stringify(body)})
        .then(saveLogin)
		.catch(console.error);

};

*/
