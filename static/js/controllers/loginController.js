/**
 * Created by ulrike on 28.01.17.
 */


myApp.controller('LoginCtrl',
  ['$scope', '$location', '$timeout', '$window', '$rootScope', 'AuthService', 'UserObjectFactory', 'loggedInUser',
  function ($scope, $location, $timeout, $window, $rootScope, AuthService, UserObjectFactory, loggedInUser) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.email, $scope.loginForm.password)
        // handle success
        .then(function () {
          console.log("We just made a successfull HTTP call and now we can continue to dashboard ...");
          //

          $scope.disabled = false;
          $scope.loginForm = {};

          $window.location.href = "#";

        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

