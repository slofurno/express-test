var angular = require('angular');
var uiRouter = require('angular-ui-router');

var accountService = require("./accountService");
var httpService = require("./httpService");

var loginController = require("./loginController");
var adsController = require('./adsController');
var signupController = require('./signupController');
var usersController = require('./usersController');

var app = angular.module('app', [uiRouter]);

app.factory("httpService", [httpService]);
app.factory("accountService", ["$http", accountService]);

app.controller("loginController", ["$scope", "$state", "accountService", loginController]);

app.controller("adsController", ["$scope", "accountService", adsController]);

app.controller("menuController", ["$scope", "accountService", function($scope, authService) {
	$scope.auth = authService;	
}]);

app.controller("usersController", ["accountService", usersController]);
app.controller("signupController", ["$state", "accountService", signupController]);
app.controller("homeController", ["$scope", "$state", "accountService", homeController]);
app.controller("profileController", ["accountService", function(authService) {
    var vm = this;
    console.log("getting profile");
    authService.getProfile()
        .then(res => {
            console.log(res);
        });
    
}]);

function homeController ($scope, $state, authService)
{

    if (!authService.account) {

    } else if (authService.account.role === "user") {
        $state.go("users"); 
    } else {
        $state.go("sponsors");
    }
}

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/"); 

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home.html',
            controller: 'homeController'
        })

        .state('signup', {
            url: '/signup',
            templateUrl: 'signup.html',
            controller: 'signupController',
            controllerAs: 'vm'
        })
        
        .state('login', {
            url: '/login',
            templateUrl: "login.html",
            controller: "loginController"
        })

        .state('profile', {
            url: '/profile',
            templateUrl: "profile.html",
            controller: "profileController",
            controllerAs: "vm"
        })
        
        .state('users', {
            url: '/users',
            templateUrl: 'users.html',
            controller: "usersController",
            controllerAs: "vm"
        })

        .state('sponsors', {
            url: '/sponsors',
            templateUrl: 'sponsors.html',
            controller: "adsController"
        });

}]);
