/**
 * Created by ulrike on 18.01.17.
 */


angular.module('startController', [])
.controller('StartCtrl', function($scope, Api, TestFactory, $location, loggedInUser) {


      Api.User.get({
        id: loggedInUser.userId
     }, function(data) {
                 console.log("Load current user data and his topics ...");
                 $scope.user = data;
                 console.log($scope.user);

                 // now give only the user's topics so that the dropdown menu can be initiated
                 $scope.usertopics = data.USER.topics;
                 console.log($scope.usertopics);
  
             });

         $scope.selectAction = function() {

         // actions to do on selected topic from Dropdown menu

        console.log("Lade Topic view with topic " + $scope.myDropDown);

/*        $scope.addTopicStatus = false;
        $scope.editTopicStatus = false;*/


        var paramA = $scope.myDropDown;
        var route = '/dashboard/topic/';


        // this is the redirection to the topic-view, we send the name of the current topic
        $location.path(route).search({paramA: $scope.myDropDown});


        //loadQuerys();


    };

      $scope.selectPanel = function(title) {

         // actions to do on selected topic from Dropdown menu

        console.log("Lade Topic view with topic " + title);

/*        $scope.addTopicStatus = false;
        $scope.editTopicStatus = false;*/


        var paramA = title;
        var route = '/dashboard/topic/';


        // this is the redirection to the topic-view, we send the name of the current topic
        $location.path(route).search({paramA: title});


        //loadQuerys();


    };

        $scope.addTopic = function() {
        console.log("Clicked Add Topic!");
        // set variables to null, to modificate the view

           /* $scope.addTopicStatus = true;
            $scope.documentCollection = [];
            $scope.myDropDown = "";
            $scope.selectedTopic = {};
            $scope.iDsOfquerysForSelectedTopic = {};
            $scope.oldTopicTitle = "";*/

        var route = '/dashboard/newTopic';


        // this is the redirection to the new-topic-form
        $location.path(route);
    };
    
    
});