/**
 * Created by ulrike on 01.02.17.
 */

// static/js/controllers/newTopicController.js

// ..


myApp.controller('NewTopicCtrl', function($scope, Api) {

// ..

var newQueryData = {
    'status.active': true,
    'status.user': userId,
    'term': $scope.newQuery
};

new Api.NewQuery(newQueryData).$save().then(function() {
    console.log("Sent query to db!");

});

    // ..

});