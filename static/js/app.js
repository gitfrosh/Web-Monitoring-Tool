'use strict';

var myApp = angular.module('myApp', [
 'ngRoute',
]);

myApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
             when('/', {
                 redirectTo: '/dashboard/'
             }).
             when('/dashboard', {
                 // Show elements depending on user details:
                 // Does user have any topics saved?
                 // get uUser topics in array from DB
                 // show the first (if available), and fill in site elements

                // http://stackoverflow.com/questions/26239071/how-to-show-mvc-logged-in-username-with-angularjs

                 templateUrl: '../static/partials/topic-view.html',
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
    }]);