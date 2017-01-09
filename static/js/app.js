'use strict';


var myApp = angular.module('myApp', [
 'ngRoute', 'ngResource'
]);


myApp.factory('Document', function($resource) {
  return $resource("/api/documents/:query", {}, {
    query: { method: "GET", isArray: false }
  });
});


myApp.controller('DocumentsCtrl', function($scope, Document) {

    // fetch queryId from UserCtrl

    // Get specific Documents
   Document.get({query: queryId}, function(data) {
   $scope.documents = data;
   console.log($scope.documents);
  });

});


myApp.factory('User', function($resource) {
  return $resource("/api/users/:id", {}, {
    query: { method: "GET", isArray: false }
  });
});


myApp.controller('UserLoginCtrl', function($scope, User) {
  // Get specific User, curently only used for Hello-Statement in top bar
   User.get({id: "5873de1dae29a94ff4c2edde"}, function(data) {
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
  User.get({id: "5873de1dae29a94ff4c2edde"}, function(data) {
    $scope.user = data;
    //console.log($scope.user);

    // now give only the user's topics
    $scope.usertopics = data.USER.topics;


    $scope.getContent = function(usertopics){
     return usertopics.value + " " + obj.text;
     };


    // put the topics' titles in an array
    $scope.usertopictitles = [];


    for (var i = 0, l = $scope.usertopics.length; i < l; i++) {
        $scope.usertopictitles.push($scope.usertopics[i].title);
       // console.log($scope.querys.push(data.USER.topics.querys[i]))
        }


    $scope.myDropDown = $scope.usertopictitles[0];
    console.log("myDropDown=" +$scope.myDropDown);


    $scope.selectAction = function() {
    console.log("myDropDown=" + $scope.myDropDown);
    //console.log($scope.usertopics);
    $scope.querysForSelectedTopic =   _.find($scope.usertopics, function(item) {
                return item.title ===  $scope.myDropDown;
                    });
    console.log($scope.querysForSelectedTopic);

    // here give only the user's topics' querys - so that matching documents can be retrieved
    console.log($scope.querysForSelectedTopic.querys);

        };


      
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