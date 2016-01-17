var angular = require('angular');
var uiRouter = require('angular-ui-router');
var loginController = require("./loginController");
var accountService = require("./accountService");
var httpService = require("./httpService");
var adsController = require('./adsController');

var app = angular.module('app', [uiRouter]);

app.factory("httpService", [httpService]);
app.factory("accountService", ["$http", accountService]);

app.controller("loginController", ["$scope", "accountService", loginController]);

app.controller("adsController", ["$scope", "accountService", adsController]);

app.controller("menuController", ["$scope", "accountService", function($scope, authService) {
	$scope.auth = authService;	

}]);

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/"); 

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home.html'
        })
        
        .state('login', {
            url: '/login',
            templateUrl: "login.html",
            controller: "loginController"
        })

        .state('ads', {
            url: '/ads',
            templateUrl: 'ads.html',
            controller: "adsController"
        });

}]);
