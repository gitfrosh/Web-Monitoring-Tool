'use strict';

// ///////////////////////////////////////////////Module

var myApp = angular.module('myApp', [
    'apiFactory', 'infiniteScroll','docController', 'testFactory', 'userController','topicController','ngRoute', 'ngResource', 'angular.filter'
]);


// ///////////////////////////////////////////////Constants


myApp.constant("loggedInUser", {
    "userId": "587e0445490b8e64935f305d"
});

// ///////////////////////////////////////////////Values


myApp.value('THROTTLE_MILLISECONDS', null);


// ///////////////////////////////////////////////Configuration


myApp.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/', {
            redirectTo: '/dashboard/'
        }).
        when('/dashboard', {
            // Show elements depending on user details:
            // Does user have any topics saved?
            // get uUser topics in array from DB
            // show the first (if available), and fill in site elements

            controller: 'TopicCtrl',
            templateUrl: '../static/partials/topic-view.html',
        }).
        when('/dashboard/document/:itemId', {
            controller: 'DocumentCtrl',
            templateUrl: '../static/partials/document-view.html',
        }).
        when('/dashboard/newsletter', {
            templateUrl: '../static/partials/newsletter.html',
        }).
        when('/dashboard/userconfig', {
            templateUrl: '../static/partials/user-config.html',
        }).
        when('/dashboard/usersources', {
            templateUrl: '../static/partials/user-sources.html',
        }).
        when('/dashboard/logout', {
            controller: 'Logout'
        }).
        otherwise({
            redirectTo: '/dashboard/'
        })

        ;
    }
]);



