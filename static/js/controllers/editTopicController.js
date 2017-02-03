/**
 * Created by ulrike on 18.01.17.
 */
myApp.controller('EditTopicCtrl', function($scope, UserObjectFactory, Api, TestFactory, $location, loggedInUser) {

    var userId = loggedInUser.userId;
    $scope.myDropDown = $location.search().paramA;
    console.log($scope.myDropDown);
    //$scope.selectedTopic = {};
    $scope.usertopictitles = [];
    $scope.usertopics = [];
    //$scope.selectedTopic.querys = [];
    $scope.checkboxStatus = {};
    $scope.documentCollection = [];



    ////////////////***************************************************************************Modal Stuff

    $scope.showModal1 = false;
    $scope.showModal3 = false; // distinction between only query updated and everything else???
    $scope.showModal4 = false;

    $scope.hide = function(m, postDataTitle) {
        if (m === 1) {
            $scope.showModal1 = false;
        } else if (m === 3) {
            $scope.showModal3 = false;
            redirectToTopic(postDataTitle)
        } else {
            $scope.showModal4 = false;
            redirectToEditTopic(postDataTitle)
        }
    };



    $scope.cancelEdit = function() {
        $scope.showModal1 = false;
        $scope.showModal3 = false; // distinction between only query updated and everything else???
        $scope.showModal4 = false;
        var paramA = $scope.myDropDown;
        var route = '/topic/';

        // this is the redirection to the edit-topic view, we send the topic name
        $location.path(route).search({
            paramA: paramA
        });

    };



    //////////////////////***

    function redirectToTopic(postDataTitle) {

        var paramA = postDataTitle;
        var route = '/topic/';

        // this is the redirection to the edit-topic view, we send the topic name
        $location.path(route).search({
            paramA: paramA
        });

    }

    function loadQuerys() {

        /////////////!!!DRY!!! also in editTopic/////////////////////////////////////////////////////////////////////


        // now that we know the query IDs we must find the querys' objects

        $scope.queryObjects = [];

        if ($scope.iDsOfquerysForSelectedTopic.length >= 1) {

            for (var i = 0, l = $scope.iDsOfquerysForSelectedTopic.length; i < l; i++) {

                // get the query's names here...
                Api.QuerybyId.get({
                    id: $scope.iDsOfquerysForSelectedTopic[i].$oid

                }, function(data) {
                    $scope.rawData = data;

                    // add outputs of more than one query to the collection
                    $scope.queryObjects.push($scope.rawData);

                    console.log($scope.queryObjects);
                })

            }

        } else if (!$scope.iDsOfquerysForSelectedTopic.length) {
            console.log("There are no querys to retrieve.")
        }


    }




    function redirectToEditTopic(postDataTitle) {

        var paramA = postDataTitle;
        var route = '/editTopic/';

        // this is the redirection to the edit-topic view, we send the topic name
        $location.path(route).search({
            paramA: paramA
        });

    }


    // also used i startController ---->>>> REDUNDANCE
    Api.User.get({
        id: loggedInUser.userId
    }, function(data) {
        console.log("Load current user data and his topics ...");
        $scope.user = data;

        UserObjectFactory.setUserObject($scope.user);
        $scope.usertopics = UserObjectFactory.getTopics();
        $scope.usertopictitles = UserObjectFactory.getTopicTitles();

        console.log("Lade Topic view with topic " + $scope.myDropDown); // on first initiate this is empty!

        UserObjectFactory.setDropdown($scope.myDropDown);
        $scope.selectedTopic = UserObjectFactory.getselTopic();
        $scope.iDsOfquerysForSelectedTopic = UserObjectFactory.getSelTopicQuerys();

        $scope.checkboxStatus.active = $scope.selectedTopic.active == "True";
        $scope.checkboxStatus.collab = $scope.selectedTopic.collaboration == "True";


        // now that we know the query IDs we must find the querys' objects
        loadQuerys();


    });



    // Topic form process

    $scope.submitTopicForm = function() {
        console.log("Topic Form submitted ...");
        dbAction();

    };


    function existsNotYet(newTopic) {
        // checks if user changes a topic title to an existing one
        existsNot = _.find($scope.usertopics, function(item) {
            return item.title === newTopic;
        });

        console.log(existsNot);
        return !existsNot;
        // we should inform the user if he entered a topic title that already exists //todo

    }

    function dbAction() {

        // THIS FUNCTION IS MONSTROUS!!!!!

        $scope.oldTopicTitle = $scope.myDropDown;
        var postOldTitle = $scope.oldTopicTitle;

        // only remember the new topic title if user has entered any AND it differs from old one

        if ($scope.newTopicTitle != $scope.oldTopicTitle && $scope.newTopicTitle != undefined && existsNotYet($scope.newTopicTitle)) {
            $scope.postDataTitle = $scope.newTopicTitle

        } else {
            $scope.postDataTitle = $scope.oldTopicTitle;
        }

        var postData;
        postData = {
            "topic.status": $scope.checkboxStatus.active,
            "topic.collaboration": $scope.checkboxStatus.collab,
            "topic.owner": userId,
            "topic.title": $scope.postDataTitle,
            "oldtopic.title": postOldTitle
            //"topic.querys" : $scope.selectedTopic.querys // we send this with an extra call
        };
        console.log(postData);

        if ($scope.newQuery) {

            console.log("user entered: " + $scope.newQuery);
            console.log($scope.queryObjects);

            // check first if new Query has the same term as an existing query IN THE SAME TOPIC
            var check = _.some($scope.queryObjects, function(el) {
                return el.QUERY.term === $scope.newQuery;
            });

            if (check) {
                console.log("This query already exists. Inform user and do nothing else.");
                $scope.showModal1 = true;
                console.log($scope.showModal1);
                return


            } else {
                console.log("This query is not yet in user's data. Check if the query exists overall (for another " +
                    "user)");

                var response1 = Api.AllQuerys.get({}, function() {
                    console.log("GET item from server....");
                });

                response1.$promise.then(function(data) {
                    $scope.allQuerys = data.QUERYS;
                    console.log($scope.allQuerys);

                    var check2 = _.some($scope.allQuerys, function(el) {
                        return el.term === $scope.newQuery;
                    });
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
                            "query.user": userId
                        };


                        $scope.newQueryStatus = new Api.QuerybyIDStatus(newQueryStatusData).$update({
                            id: $scope.newQueryfromServer._id.$oid
                        }).then(function() {
                            console.log("Neuer Status gesendet..");
                        });

                        console.log("... and we push the the queryID onto  user's data!!! ");


                        var postDataQuerys2 = {
                            "topic.title": $scope.postDataTitle,
                            "query.id": $scope.newQueryfromServer._id.$oid

                        };
                        console.log(postDataQuerys2);


                        $scope.alsoPushedQuerys = new Api.UserbyIDNewQuery(postDataQuerys2);
                        $scope.alsoPushedQuerys.$update({
                            id: userId
                        }).then(function() {
                            console.log("RESET!!");

                            //DRY//!!!!!!!!!!!!!!!!
                            $scope.showModal3 = true;
                            console.log($scope.showModal3);

                            //$scope.showModal3 = true;

                        });



                    } else {
                        console.log("This query does not exist on the server at all. We have to push it there, set the" +
                            "the value for the user to TRUE and push it to the user's data.");


                        // that's what the new query looks like, initiated with the first user-status
                        var newQueryData = {
                            'status.active': true,
                            'status.user': userId,
                            'term': $scope.newQuery
                        };
                        console.log(newQueryData);


                        new Api.NewQuery(newQueryData).$save().then(function() {
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
                                        "topic.title": $scope.postDataTitle,
                                        "query.id": $scope.newQueryfromServer._id.$oid

                                    };
                                    console.log(updateQueryinTopic);

                                    new Api.UserbyIDNewQuery(updateQueryinTopic).$update({
                                        id: userId
                                    }).then(function() {
                                        console.log("RESET!!");

                                        //DRY//!!!!!!!!!!!!!!!!
                                        console.log($scope.postDataTitle);
                                        //DRY//!!!!!!!!!!!!!!!!
                                        $scope.showModal3 = true;
                                        console.log($scope.showModal3);

                                    });
                                }

                            );



                        });




                    }
                });



            }




        } else {
            console.log("User did not enter a new query.");

        }


        // put topic in db, WHEN FINISHED load data once more
        $scope.newOrEditedTopic = new Api.UserbyIdTopic(postData);
        $scope.newOrEditedTopic.$update({
            id: userId
        }).then(function() {

            if ($scope.oldTopicTitle) {

                for (var i = 0, l = $scope.selectedTopic.querys.length; i < l; i++) {

                    var postDataQuerys = {
                        "topic.title": $scope.postDataTitle,
                        "query.id": $scope.selectedTopic.querys[i].$oid

                    };
                    console.log(postDataQuerys);

                    $scope.alsoPushedQuerys = new Api.UserbyIDNewQuery(postDataQuerys);
                    $scope.alsoPushedQuerys.$update({
                        id: userId
                    }).then(function() {
                        console.log("RESET!!");

                        //DRY//!!!!!!!!!!!!!!!!
                        console.log($scope.postDataTitle);

                        //DRY//!!!!!!!!!!!!!!!!
                        $scope.showModal3 = true;
                        console.log($scope.showModal3);
                    });

                }

            } else {
                console.log("No query is pushed to db.");



            }

        });

        if ($scope.checkboxStatus.active == false) {

        }
        // change status of querys to false if topic is deactivated!! //todo

    }




});