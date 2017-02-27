/**
 * Created by ulrike on 08.02.17.
 */

myApp.controller('LogoutCtrl',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

         console.log("Try to log out..");
      // call logout from service
      AuthService.logout()
        .then(function () {

        var route = 'login';

        $location.path(route);

        });


}]);
