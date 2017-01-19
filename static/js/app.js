'use strict';

// ///////////////////////////////////////////////Module

var myApp = angular.module('myApp', [
    'apiFactory', 'editTopicController','docController','startController','newTopicController','testFactory', 'userController','topicController','ngRoute', 'ngResource', 'angular.filter'
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

            controller: 'StartCtrl',
            templateUrl: '../static/partials/start.html',
        }).
        when('/dashboard/topic', {
            controller: 'TopicCtrl',
            templateUrl: '../static/partials/topic-view.html',
        }).
         when('/dashboard/newTopic', {
            controller: 'NewTopicCtrl',
            templateUrl: '../static/partials/new-topic.html',
        }).
         when('/dashboard/editTopic', {
            controller: 'EditTopicCtrl',
            templateUrl: '../static/partials/edit-topic.html',
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



