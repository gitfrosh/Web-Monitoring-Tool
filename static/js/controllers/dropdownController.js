/**
 * Created by ulrike on 27.01.17.
 */



myApp.controller('DropdownCtrl', function($scope, $location, Api, loggedInUser) {

    $scope.myDropDown = $location.search().paramA;


      $scope.selectAction = function() {

         // THIS IS ALSO IN STARTCONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!DRY

         // actions to do on selected topic from Dropdown menu

        console.log("Lade Topic view with topic " + $scope.myDropDown);

        var paramA = $scope.myDropDown;
        var route = '/dashboard/topic/';


        // this is the redirection to the topic-view, we send the name of the current topic
        $location.path(route).search({paramA: $scope.myDropDown});

    };

    $scope.addTopic = function() {
        console.log("Clicked Add Topic!");
        // set variables to null, to modificate the view

            $scope.addTopicStatus = true;
            $scope.documentCollection = [];
            $scope.myDropDown = "";
            $scope.selectedTopic = {};
            $scope.iDsOfquerysForSelectedTopic = {};
            $scope.oldTopicTitle = "";


        var route = '/dashboard/newTopic/';

        // this is the redirection to the edit-topic view, we send the topic name
        $location.path(route);



    };
});