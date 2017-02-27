'use strict';

// ///////////////////////////////////////////////Module

var myApp = angular.module('myApp', [
    'sharedServices','testFactory','ngRoute', 'ng-fusioncharts', 'ngResource', 'angular.filter'
]);



// ///////////////////////////////////////////////Constants

myApp.service('loggedInUser', function() {
    
    var _userId = "";
    
    return {
      
        setUserId: function (userId) {
            _userId = userId;
        },
        
        getUserId: function () {

        return _userId

        }


}});

// ///////////////////////////////////////////////Configuration


myApp.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/', {
            controller: 'StartCtrl',
            templateUrl: '../static/partials/start.html',
            access: {restricted: true}
        }).
        when('/topic', {
            controller: 'TopicCtrl',
            templateUrl: '../static/partials/topic-view.html',
            access: {restricted: true}
        }).
         when('/newTopic', {
            controller: 'NewTopicCtrl',
            templateUrl: '../static/partials/new-topic.html',
            access: {restricted: true}
        }).
         when('/editTopic', {
            controller: 'EditTopicCtrl',
            templateUrl: '../static/partials/edit-topic.html',
            access: {restricted: true}
        }).
        when('/document/:itemId', {
            controller: 'DocumentCtrl',
            templateUrl: '../static/partials/document-view.html',
            access: {restricted: true}
        }).
        when('/newsletter', {
            templateUrl: '../static/partials/newsletter.html',
            access: {restricted: true}
        }).
            when('/search', {
            templateUrl: '../static/partials/search.html',
            access: {restricted: true}
        }).
            when('/help', {
            templateUrl: '../static/partials/help.html',
            access: {restricted: true}
        }).
        when('/userconfig', {
            templateUrl: '../static/partials/user-config.html',
            access: {restricted: true}
        }).
        when('/usersources', {
            templateUrl: '../static/partials/user-sources.html',
            access: {restricted: true}
        }).
        when('/login', {
            controller: 'LoginCtrl',
            templateUrl: '../static/partials/login.html',
            access: {restricted: false}
        }).
        when('/logout', {
            controller: 'LogoutCtrl',
            templateUrl: '../static/partials/login.html',
            access: {restricted: false}
        }).
        when('/register', {
            templateUrl: '../static/partials/register.html',
            controller: 'RegisterCtrl',
            access: {restricted: false}
        }).
        otherwise({
            redirectTo: '/login',
            access: {restricted: true}
        })

        ;
    }
]);


//////////////These functions detect route changes while app is running, e.g. reloading the page or changing the route
// internally, this stuff is necessary to check the login status and shut out not logged in users

myApp.run(function ($rootScope, $location, $route, AuthService,  loggedInUser) {

    var restricted_c = false;


       $rootScope.$on('$routeChangeStart', function (event, next, current) {


        if (next['access']) {
            restricted_c = next.access.restricted;
            //restricted_n = next.access.restricted;
            console.log("OnRouteChangeStart: Oh! Loading a new Page! Is it restricted?: " + restricted_c);
            //console.log("Auth.logged " + AuthService.isLoggedIn());

        }
       else restricted_c = true});




  $rootScope.$on('$routeChangeStart',
    function ($timeout, $scope, event, next, current) {

      AuthService.getUserStatus()
      .then(function(){
        if (restricted_c && !AuthService.isLoggedIn()){
            console.log("OnRouteChangeStart2: No user is logged in and page is restricted! .. we redirect to login ..");

            $scope.disabled = false;
            $scope.loginForm = {};

            $location.path('/login');

            //$route.reload();
        } else {

            console.log("OnRouteChangeStart2: Oh! The requested page is probably not restricted OR the user is signed in well .. if ther" +
                "e is a user logged in, the ID follows...  "+ loggedInUser.getUserId());
        }
      });
  });
});





