/**
 * Created by ulrike on 15.02.17.
 */


myApp.controller('RegisterCtrl',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {


    ////////////////***************************************************************************Modal Stuff

    $scope.showModal5 = false;

    $scope.hide = function(){
            $scope.showModal5 = false;
            $location.path('login');
    };

    //////////////////////***



    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      var registerData ="";
        registerData = {
            "email": $scope.registerForm.email,
            "name": $scope.registerForm.name,
            "password": $scope.registerForm.password
        };

      // call register from service
      AuthService.register(registerData)
        // handle success
        .then(function () {
          $scope.showModal5 = true;

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
