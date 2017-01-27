/**
 * Created by ulrike on 25.01.17.
 */

'use strict';

var myApp = angular.module('myApp', ['ngRoute'
    // declare more module dependencies here
]);

myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            redirectTo: '/dashboard/'
        }).
        when('/dashboard', {
            controller: 'StartCtrl',
            templateUrl: '../static/partials/start.html'
        }).
        when('/dashboard/topic', {
            controller: 'TopicCtrl',
            templateUrl: '../static/partials/topic-view.html'
        }).
        when('/dashboard/document/:itemId', {
            controller: 'DocumentCtrl',
            templateUrl: '../static/partials/document-view.html'
        }).
        otherwise({
            redirectTo: '/dashboard/'
        })
        // more routes ..
        ;
    }
]);


