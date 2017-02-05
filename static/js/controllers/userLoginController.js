/**
 * Created by ulrike on 05.02.17.
 */
myApp.controller('UserLoginCtrl', function($scope, Api, loggedInUser) {
    // Get specific User, curently only used for Hello-Statement in top bar
    Api.User.get({
        id: loggedInUser.getUserId()
    }, function(data) {
        $scope.user = data;
    });

});