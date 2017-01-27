/**
 * Created by ulrike on 18.01.17.
 */


myApp.controller('NewTopicCtrl', function($scope, Api, TestFactory, $location, loggedInUser) {

    $scope.checkboxStatus = {};
    $scope.checkboxStatus.active = false;
    $scope.checkboxStatus.collab = false;



////////////////***************************************************************************Modal Stuff

    $scope.showModal2 = false;

    $scope.hide = function(m){
            $scope.showModal2 = false;
            redirect()
    };

    //////////////////////***

    function redirect() {

        var paramA = $scope.newTopicTitle;
        var route = '/dashboard/editTopic/';

        // this is the redirection to the edit-topic view, we send the topic name
        $location.path(route).search({paramA: paramA});

    }







    $scope.cancel = function() {

        // DRY AGAIN!!!!!!!!!

        // evtl. Dialogbox...

        console.log("Lade Dashboard neu");
        var route = '/dashboard/';

        // this is the redirection to dashboard
        $location.path(route);

    };





    var userId = loggedInUser.userId;
       // Topic form process
    $scope.submitTopicForm = function() {

        // THIS FUNCTION IS MONSTROUS!!!!!

/*        $scope.oldTopicTitle = $scope.myDropDown;

        if ($scope.selectedTopic.active == "True"){
               $scope.checkboxStatus.active = true
          } else {
              $scope.checkboxStatus.active = false
          }

          if ($scope.selectedTopic.collaboration == "True"){
               $scope.checkboxStatus.collab = true
          } else {
              $scope.checkboxStatus.collab = false
          }*/

        console.log("Topic Form submitted ...");
        // console.log($scope.checkboxStatus.collab);
        // console.log($scope.checkboxStatus.active);
        console.log($scope.newTopicTitle);
        // console.log($scope.oldTopicTitle);
        // console.log($scope.selectedTopic.querys);



        // var postOldTitle = $scope.oldTopicTitle;
        //
        // if ($scope.newTopicTitle === undefined){
        //     var postDataTitle = $scope.oldTopicTitle;
        // }
        //
        //
        // // only remember the new topic title if user has entered one
        // if ($scope.newTopicTitle != $scope.oldTopicTitle && $scope.newTopicTitle != undefined) {
          var postDataTitle = $scope.newTopicTitle;
        // } else {
        //     postDataTitle =  $scope.oldTopicTitle;
        // }


        var postData;
        postData = {
            "topic.status": $scope.checkboxStatus.active,
            "topic.collaboration": $scope.checkboxStatus.collab,
            "topic.owner": userId,
            "topic.title": postDataTitle,
            "oldtopic.title": ""
        };
        console.log(postData);


        // put topic on the server, WHEN FINISHED load data once more
        $scope.newOrEditedTopic = new Api.UserbyIdTopic(postData);
        $scope.newOrEditedTopic.$update({
            id: userId
        }).then(function() {

            console.log("This is a new topic. No query is pushed to db.");
            console.log("User adds querys (required form field)");


                    });

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


                                // inform user that he can add more querys! //todo

                                 //DRY//!!!!!!!!!!!!!!!!
                                $scope.showModal2 = true;
                        


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
                                 // inform user that he can add more querys! //todo

                                    
                                 //DRY//!!!!!!!!!!!!!!!!
                                $scope.showModal2 = true;
                   



                });
                            }

                            );



                                       });








                                             }});





            };


});