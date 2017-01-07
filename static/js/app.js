'use strict';


var myApp = angular.module('myApp', [
 'ngRoute', 'ngResource'
]).controller('Hello', function($scope, $http) {
    $http.get('http://rest-service.guides.spring.io/greeting').
        then(function(response) {
            $scope.greeting = response.data;
        });
});


myApp.factory('User', function($resource) {
  return $resource("/api/users/:id", {}, {
    query: { method: "GET", isArray: false }
  });
});


myApp.controller('UserLoginCtrl', function($scope, User) {
  // Get specific User, curently only used for Hello-Statement in top bar
   User.get({id: "586f791f73fa964fe89bac81"}, function(data) {
   $scope.user = data;
  });

});


myApp.controller('UserCtrl', function($scope, User) {
  // Get all users
   User.query(function(data) {
    $scope.users = data.users;
  });

  // Our form data for creating a new User with ng-model
  $scope.postData = {};
  $scope.newUser = function() {
    var user = new User($scope.postData);
    user.$save();
  };

  // Get specific User with the following Id ... (hardcoded)
  User.get({id: "586f791f73fa964fe89bac81"}, function(data) {
    $scope.user = data;
    //console.log($scope.user);

    // now give only the user's topics
    $scope.usertopics = data.USER.topics;

    // put the topics' titles in an array
    $scope.usertopictitles = [];

    for (var i = 0, l = $scope.usertopics.length; i < l; i++) {
        $scope.usertopictitles.push($scope.usertopics[i].title);
        }
    console.log($scope.usertopictitles);


})
});

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

                 controller: 'UserCtrl',
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