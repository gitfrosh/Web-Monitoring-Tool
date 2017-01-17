/**
 * Created by ulrike on 17.01.17.
 */


angular.module('userController', [])
.controller('UserLoginCtrl', function($scope, Api, loggedInUser) {
    // Get specific User, curently only used for Hello-Statement in top bar
    Api.User.get({
        id: loggedInUser.userId
    }, function(data) {
        $scope.user = data;
    });

});