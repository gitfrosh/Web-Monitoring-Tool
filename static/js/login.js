/**
 * Created by ulrike on 28.01.17.
 */
'use strict';

// ///////////////////////////////////////////////Module

var login = angular.module('login', [
    'ngRoute', 'ngResource'
]);


login.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/', {
            controller: 'LoginCtrl',
            templateUrl: '../static/partials/login_form.html',
        }).

        otherwise({
            redirectTo: '/'
        })

        ;
    }
]);

login.controller('LoginCtrl', function($scope) {
    // Get specific User, curently only used for Hello-Statement in top bar
/*    Api.User.get({
        id: loggedInUser.userId
    }, function(data) {
        $scope.user = data;
    });*/

});
//////////////