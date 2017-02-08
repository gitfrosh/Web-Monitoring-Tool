'use strict';

// ///////////////////////////////////////////////Module

var myApp = angular.module('myApp', [
    'sharedServices','testFactory','ngRoute', 'ngResource', 'angular.filter'
]);

myApp.factory('AuthService',
  ['$q', '$timeout', '$http', 'loggedInUser',
  function ($q, $timeout, $http, loggedInUser) {

    // create user variable
    var user = false;

    // return available functions for use in controllers
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register,
      getUserStatus: getUserStatus
    });

    function isLoggedIn() {
      return !!user;
    }

    function login(email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/users/', {email: email, password: password})
        // handle success
        .success(function (data, status) {

          console.log("The user has entered data and a HTTP call was made...");

          if(status === 200 && data[0].result){
            user = true;

            loggedInUser.setUserId(data[1].userId);

            console.log("HTTP call 200 and verification okay.. we just set the loggedInUser-ID to .." +
              loggedInUser.getUserId() + " and we set the user to" + user);

            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      loggedInUser.setUserId("");

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/logout/')
        // handle success
        .success(function (data) {
          user = false;

          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(email, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/register', {email: email, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.result){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function getUserStatus() {
      return $http.get('/api/status/')
      // handle success

      .success(function (data) {

           console.log("We just made the HTTP call and got the UserStatus: " + data[0].status + "and Id " + data[1].userId);

        if(data[0].status){
          user = true;
          loggedInUser.setUserId(data[1].userId);
            

        } else {
          user = false;
        }
      }


      )
      // handle error
      .error(function (data) {
        user = false;
      });


    }




}]);


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

// myApp.value("loggedInUser", {
//
//     "userId": ""
//
//     //"userId": UserObjectFactory.getUserId()
// });
// ///////////////////////////////////////////////Values


myApp.value('THROTTLE_MILLISECONDS', null);


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
        when('/search', {
            templateUrl: '../static/partials/user-sources.html',
            access: {restricted: true}
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


//////////////

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









myApp.controller('UserLoginCtrl', function($scope, Api, loggedInUser) {
    // Get specific User, curently only used for Hello-Statement in top bar
    // Api.User.get({
    //     id: loggedInUser.getUserId()
    // }, function(data) {
    //     $scope.user = data;
    // });

});

myApp.controller('LogoutCtrl',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

         console.log("Try to log out..");
      // call logout from service
      AuthService.logout()
        .then(function () {

        var route = 'login';

        $location.path(route);
         // $window.location.href = "http://0.0.0.0:5000/dashboard/#/login";

        });


}]);


myApp.controller('RegisterCtrl',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.email,
                           $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

}]);
