/**
 * Created by ulrike on 18.01.17.
 */


angular.module('editTopicController', [])
.controller('EditTopicCtrl', function($scope, Api, TestFactory, $location, loggedInUser) {

    var userId = loggedInUser.userId;
    $scope.myDropDown = $location.search().paramA;
    console.log($scope.myDropDown);
    $scope.selectedTopic = {};
    $scope.usertopictitles = [];
    $scope.usertopics = [];
    $scope.selectedTopic.querys = [];
    $scope.checkboxStatus = {};
    $scope.documentCollection = [];



            // also used i startController ---->>>> REDUNDANCE
         Api.User.get({
        id: loggedInUser.userId
     }, function(data) {
             console.log("Load current user data and his topics ...");
             $scope.user = data;
             console.log($scope.user);


    console.log($scope.myDropDown);

             // now give only the user's topics so that the dropdown menu can be initiated
             $scope.usertopics = data.USER.topics;
             console.log($scope.usertopics);
             console.log($scope.usertopictitles);

             // put the topics' titles in an array
             for (var i = 0, l = $scope.usertopics.length; i < l; i++) {
                 $scope.usertopictitles.push($scope.usertopics[i].title);
             }

                console.log("Lade Topic view with topic " + $scope.myDropDown);

            // fetch the topic object from server and store it in "selectedTopic"
            $scope.selectedTopic = _.find($scope.usertopics, function(item) {
            return item.title === $scope.myDropDown;
        });

    console.log($scope.selectedTopic);



          if ($scope.selectedTopic.active == "True"){
               $scope.checkboxStatus.active = true
          } else {
              $scope.checkboxStatus.active = false
          }

          if ($scope.selectedTopic.collaboration == "True"){
               $scope.checkboxStatus.collab = true
          } else {
              $scope.checkboxStatus.collab = false
          }





        // bind IDs of querys ...
        $scope.iDsOfquerysForSelectedTopic = $scope.selectedTopic.querys;

        console.log($scope.selectedTopic.querys);

         // now that we know the query IDs we must find the querys' objects (and the data; collab status, activeness
          // status, suggestions, name, ...

          $scope.queryObjects = [];

          if ($scope.iDsOfquerysForSelectedTopic.length >= 1) {

              for (var i = 0, l = $scope.iDsOfquerysForSelectedTopic.length; i < l; i++) {

              // get the query's names here...
              Api.QuerybyId.get({
                  id: $scope.iDsOfquerysForSelectedTopic[i].$oid

              }, function (data) {
                  $scope.rawData = data;

                  // add outputs of more than one query to the collection
                  $scope.queryObjects.push($scope.rawData);

                  // flatten the array
                  //$scope.documentCollection = _.flatten($scope.documentCollection);

                  console.log($scope.queryObjects);
              })

          }

          } else if (!$scope.iDsOfquerysForSelectedTopic.length) {
              console.log("There are no querys to retrieve.")
          }
});


     $scope.selectAction = function() {

         // THIS IS ALSO IN STARTCONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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


     // THIS IS ALSO IN STARTCONTROLLER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            $scope.addTopic = function() {
        console.log("Clicked Add Topic!");
        // set variables to null, to modificate the view

           /* $scope.addTopicStatus = true;
            $scope.documentCollection = [];
            $scope.myDropDown = "";
            $scope.selectedTopic = {};
            $scope.iDsOfquerysForSelectedTopic = {};
            $scope.oldTopicTitle = "";*/

        var route = '/dashboard/newtopic/';


        // this is the redirection to the new-topic-form
        $location.path(route);
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////DRRRRYYYYY


    // Topic form process

    $scope.submitTopicForm = function() {

                dbAction();

            };

    function dbAction() {



                // THIS FUNCTION IS MONSTROUS!!!!!

        $scope.oldTopicTitle = $scope.myDropDown;


        console.log("Topic Form submitted ...");
        console.log($scope.checkboxStatus.collab);
        console.log($scope.checkboxStatus.active);
        console.log($scope.newTopicTitle);
        console.log($scope.oldTopicTitle);
        console.log($scope.selectedTopic.querys);



        var postOldTitle = $scope.oldTopicTitle;

        if ($scope.newTopicTitle === undefined){
            var postDataTitle = $scope.oldTopicTitle;
        }


        // only remember the new topic title if user has entered one
        if ($scope.newTopicTitle != $scope.oldTopicTitle && $scope.newTopicTitle != undefined) {
            postDataTitle = $scope.newTopicTitle
        } else {
            postDataTitle =  $scope.oldTopicTitle;
        }


        var postData;
        postData = {
            "topic.status": $scope.checkboxStatus.active,
            "topic.collaboration": $scope.checkboxStatus.collab,
            "topic.owner": userId,
            "topic.title": postDataTitle,
            "oldtopic.title": postOldTitle
            //"topic.querys" : $scope.selectedTopic.querys // we send this with an extra call
        };
        console.log(postData);


        // put topic in db, WHEN FINISHED load data once more
        $scope.newOrEditedTopic = new Api.UserbyIdTopic(postData);
        $scope.newOrEditedTopic.$update({
            id: userId
        }).then(function() {

            if ($scope.oldTopicTitle) {

                for (var i = 0, l = $scope.selectedTopic.querys.length; i < l; i++) {

                    var postDataQuerys = {
                        "topic.title": postDataTitle,
                        "query.id": $scope.selectedTopic.querys[i].$oid

                    };
                    console.log(postDataQuerys);

                    $scope.alsoPushedQuerys = new Api.UserbyIDNewQuery(postDataQuerys);
                    $scope.alsoPushedQuerys.$update({
                        id: userId
                    }).then(function () {
                        console.log("RESET!!");

                                //DRY//!!!!!!!!!!!!!!!!

                                var paramA = postDataTitle;
                                var route = '/dashboard/topic/';

                                // this is the redirection to the edit-topic view, we send the topic name
                                $location.path(route).search({paramA: paramA});

                    });

                }

            } else {
                console.log("No query is pushed to db.");



            }
        });
            if ($scope.newQuery) {

                console.log("user entered: " + $scope.newQuery);
                console.log($scope.queryObjects);

                // check first if new Query has the same term as an existing query IN THE SAME TOPIC
                var check = _.some($scope.queryObjects, function( el ) {
                    return el.QUERY.term === $scope.newQuery;
                    } );

                if (check) {
                    console.log("This query already exists. Inform user and do nothing else."); //todo

                } else {
                    console.log("This query is not yet in user's data. Check if the query exists overall (for another " +
                        "user)");

                        var response1 = Api.AllQuerys.get({}, function() {
                                    console.log("GET item from server....");
                                    });

                            response1.$promise.then(function(data) {
                        $scope.allQuerys = data.QUERYS;
                        console.log($scope.allQuerys);

                            var check2 = _.some($scope.allQuerys, function( el ) {
                            return el.term === $scope.newQuery;
                             } );
                            console.log(check2);

                         if (check2) {
                                console.log("This query exists on the server. We push the status for the user to True");

                                // fetch the query from server to find out the ID of the query
                                    $scope.newQueryfromServer = _.find($scope.allQuerys, function(item) {
                                    return item.term === $scope.newQuery;
                                            });

                                 console.log($scope.newQueryfromServer);
                                 console.log("newID: " + $scope.newQueryfromServer._id.$oid);


                             // change queryStatus for user in db
                                var newQueryStatusData = {
                                     "query.status": true,
                                     "query.user" : userId
                                         };


                                $scope.newQueryStatus = new Api.QuerybyIDStatus(newQueryStatusData).$update({
                                    id: $scope.newQueryfromServer._id.$oid
                                        }).then(function () {
                                        console.log("Neuer Status gesendet..");
                                    });

                                console.log("... and we push the the queryID onto  user's data!!! ");


                                    var postDataQuerys2 = {
                                            "topic.title": postDataTitle,
                                            "query.id": $scope.newQueryfromServer._id.$oid

                                        };
                                     console.log(postDataQuerys2);


                                  $scope.alsoPushedQuerys = new Api.UserbyIDNewQuery(postDataQuerys2);
                                         $scope.alsoPushedQuerys.$update({
                                                id: userId
                                            }).then(function () {
                                                console.log("RESET!!");

                                //DRY//!!!!!!!!!!!!!!!!

                                var paramA = postDataTitle;
                                var route = '/dashboard/editTopic/';

                                // this is the redirection to the edit-topic view, we send the topic name
                                $location.path(route).search({paramA: paramA});

                                     });



                            } else {
                             console.log("This query does not exist on the server at all. We have to push it there, set the"+
                                    "the value for the user to TRUE and push it to the user's data.");


                             // that's what the new query looks like, initiated with the first user-status
                             var newQueryData = {
                                     'status.active': true,
                                     'status.user': userId,
                                     'term': $scope.newQuery
                                         };
                             console.log(newQueryData);


                             new Api.NewQuery(newQueryData).$save().then(function () {
                                   console.log("Send Query to db!");



                             // fetch the new ID ...

                                var response = Api.AllQuerys.get({}, function() {
                                    console.log("GET item from server....");
                                    });

                            response.$promise.then(function(data) {
                                    $scope.allQuerys = data.QUERYS;
                                    console.log($scope.allQuerys);



                                 // fetch the query from server to find out the ID of the query
                                    $scope.newQueryfromServer = _.find($scope.allQuerys, function(item) {
                                    return item.term === $scope.newQuery;
                                            });

                                 console.log("newID: " + $scope.newQueryfromServer);
                                console.log("newID: " + $scope.newQueryfromServer._id.$oid);

                                  var updateQueryinTopic = {
                                    "topic.title": postDataTitle,
                                    "query.id" : $scope.newQueryfromServer._id.$oid

                                 };
                                console.log(updateQueryinTopic);

                                new Api.UserbyIDNewQuery(updateQueryinTopic).$update({
                                 id: userId
                                    }).then(function () {
                                   console.log("RESET!!");

                                 //DRY//!!!!!!!!!!!!!!!!

                                var paramA = postDataTitle;
                                var route = '/dashboard/editTopic/';

                                // this is the redirection to the edit-topic view, we send the topic name
                                $location.path(route).search({paramA: paramA});

                });
                            }

                            );



                                       });








                                             }});



                                    }





            } else {
                console.log("user should at least add one new topic if new topic...");
            }
    }




    
});