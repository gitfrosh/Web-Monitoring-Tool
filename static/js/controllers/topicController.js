/**
 * Created by ulrike on 17.01.17.
 */


angular.module('topicController', [])
.controller('TopicCtrl', function($scope, Api, TestFactory, $location, loggedInUser) {

    // this controller is actually too big and complex

    var userId = loggedInUser.userId;

    // initiate some variables
    $scope.user = {};
    $scope.usertopics = [];
    $scope.usertopictitles = [];
    $scope.myDropDown = $location.search().paramA;
    $scope.addTopicStatus = false;
    $scope.editTopicStatus = false;
    $scope.selectedTopic = {};
    $scope.selectedTopic.querys = [];
    //$scope.myDropDown = ""; // default value of Dropdown: empty space for now

    // Get all users // we never need this
    //Api.User.query(function(data) {
    //    $scope.users = data.users;
    //});

    // Our form data for creating a new User with ng-model  //  this is low-priority
    //$scope.postData = {};
    //$scope.newUser = function() {
    //    var user = new Api.User($scope.postData);
    //    user.$save();
    //};

    // Get specific User with the following Id ... (hardcoded for now, see constant!!)
    // and save his topics (usertopics)
    // and save his usertopictitles (usertopictitles)

    // when the Topic-view is loaded, get the user data first


    initiateView();


    function loadQuerys() {

        if ($scope.myDropDown) { // if a topic was selected...
            console.log("Lade Topic view with topic " + $scope.myDropDown);

            // fetch the topic object from server and store it in "selectedTopic"
            $scope.selectedTopic = _.find($scope.usertopics, function(item) {
            return item.title === $scope.myDropDown;
        });

        // bind IDs of querys ...
        $scope.iDsOfquerysForSelectedTopic = $scope.selectedTopic.querys;

        console.log($scope.selectedTopic.querys);


        loadTable(); // ... load table

        } else { //... else do nothing
            console.log("No topic selected");

        }
    }



    function initiateView() {


         Api.User.get({
        id: loggedInUser.userId
     }, function(data) {
        console.log("Load current user data and his topics ...");
        $scope.user = data;
        console.log($scope.user);

        // now give only the user's topics so that the dropdown menu can be initiated
        $scope.usertopics = data.USER.topics;
        console.log($scope.usertopics);
        console.log($scope.usertopictitles);

         // put the topics' titles in an array
        for (var i = 0, l = $scope.usertopics.length; i < l; i++) {
            $scope.usertopictitles.push($scope.usertopics[i].title);
        }

        console.log("Lade Topic view with topic " + $scope.myDropDown); // on first initiate this is empty!

        loadQuerys();
});
    }

     $scope.selectAction = function() {

         // actions to do on selected topic from Dropdown menu

        console.log("Lade Topic view with topic " + $scope.myDropDown);

        $scope.addTopicStatus = false;
        $scope.editTopicStatus = false;

        loadQuerys();



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
    };


      $scope.editTopic = function() {
        console.log("Clicked Edit Topic!");


          $scope.checkboxStatus = {};
          $scope.editTopicStatus = true;
          $scope.documentCollection = [];

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


         // now that we know the query IDs we must find the querys' objects (and the data; collab status, activeness
          // status, suggestions, name, ...

          $scope.queryObjects = [];

          if ($scope.iDsOfquerysForSelectedTopic.length) {

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





    };

     // Topic form process
    $scope.submitTopicForm = function() {

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

        /*if (!$scope.selectedTopic.querys.length) {
            var sentQuerys = $scope.selectedTopic.querys;
        } else {
            sentQuerys = null;
        }*/

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


        // put topic on the server, WHEN FINISHED load data once more
        $scope.newOrEditedTopic = new Api.UserbyIdTopic(postData);
        $scope.newOrEditedTopic.$update({
            id: userId
        }).then(function() {

            if ($scope.oldTopicTitle){

                for (var i = 0, l = $scope.selectedTopic.querys.length; i < l; i++) {

                var postDataQuerys = {
                        "topic.title": postDataTitle,
                        "query.id" : $scope.selectedTopic.querys[i].$oid

                    };
                console.log(postDataQuerys);

                $scope.alsoPushedQuerys = new Api.UserbyIDNewQuery(postDataQuerys);
                $scope.alsoPushedQuerys.$update({
                    id: userId
                }).then(function () {
                    console.log("RESET!!");
                    // form should be resetted here ...

                });

            }

            } else {
                console.log("This is a new topic. No query is pushed to db.");
                console.log("User should now add the querys................");


            }

            if ($scope.newQuery) {

                // check first if query is already available

                console.log("user entered: " + $scope.newQuery);

                var postDataQuerys2 = {
                        "topic.title": postDataTitle,
                        "query.id" : $scope.newQuery

                    };
                console.log(postDataQuerys2);


                new Api.UserbyIDNewQuery(postDataQuerys2).$update({
                    id: userId
                }).then(function () {
                    console.log("RESET!!");
                    // form should be resetted here ...

                });

            } else {
                console.log("user should at least add one new topic if new topic...");
            }



            });




    };



        // Query form process
    $scope.submitQueryForm = function() {



    };








    function loadTable() {

        console.log("Load Table with documents for Topic" +  $scope.selectedTopic.title);

        // start a fresh documentCollection for our output table
        $scope.documentCollection = [];
        console.log($scope.documentCollection);

          // bind IDs of querys ...
        $scope.iDsOfquerysForSelectedTopic = $scope.selectedTopic.querys;

        console.log($scope.selectedTopic.querys);
        console.log($scope.iDsOfquerysForSelectedTopic);
        console.log($scope.iDsOfquerysForSelectedTopic.length);

        if ($scope.iDsOfquerysForSelectedTopic) {

            for (var i = 0, l = $scope.iDsOfquerysForSelectedTopic.length; i < l; i++) {

                console.log($scope.iDsOfquerysForSelectedTopic[i].$oid);

            // get the documents
            Api.Document.get({
                query: $scope.iDsOfquerysForSelectedTopic[i].$oid


            }, function(data) {
                $scope.documents = data;


                // add outputs of more than one query to the collection
                $scope.documentCollection.push($scope.documents.DOCUMENTS);

                // flatten the array
                $scope.documentCollection = _.flatten($scope.documentCollection);

                console.log($scope.documentCollection);
            })
        }

        } else {
            console.log("There are no querys/documents that can be retrieved");
        }


    }


    function loadOnlyBookmarked() {

        console.log("Load only Bookmarked documents ...");

        // start a fresh documentCollection for our output table
        $scope.rawDocumentCollection = [];
        $scope.documentCollection = [];
        $scope.documentCollection.empty = false;


        for (var i = 0, l = $scope.iDsOfquerysForSelectedTopic.length; i < l; i++) {


            // get the documents
            Api.Document.get({
                query: $scope.iDsOfquerysForSelectedTopic[i].$oid


            }, function(data) {
                $scope.documents = data;

                // add outputs of more than one query to the collection
                $scope.rawDocumentCollection.push($scope.documents.DOCUMENTS);

                // flatten the array
                $scope.rawDocumentCollection = _.flatten($scope.rawDocumentCollection);

                console.log($scope.rawDocumentCollection);

                // push all bookmarked documents onto documentCollectionOnlyBookmarked
                for (var i = 0, l = $scope.rawDocumentCollection.length; i < l; i++) {

                    console.log($scope.rawDocumentCollection.length);

                    for (var a = 0, le = $scope.rawDocumentCollection[i].bookmarks.length; a < le; a++) {

                        console.log($scope.rawDocumentCollection[i].bookmarks[a]);

                        if ($scope.rawDocumentCollection[i].bookmarks[a].b_user.$oid == userId && $scope.rawDocumentCollection[i].bookmarks[a].status == "True") {

                        //console.log(rawDocumentCollection[i].bookmarks[a].b_user);

                            $scope.documentCollection.push($scope.rawDocumentCollection[i]);
                            console.log($scope.documentCollection);
                            $scope.documentCollection.empty = false;


                    } else {
                            console.log("Es gibt keine markierten Dokumente in dieser Collection.");
                            $scope.documentCollection.push({});
                            $scope.documentCollection.empty = true;
                        }

                    }

                }

            })
        }
    }



    $scope.filterBookmarks = function() {
        console.log("Checkbox: Filter Bookmarked..");
        loadOnlyBookmarked()
    };
    $scope.showAll = function() {
        console.log("Checkbox: Load whole Table..");
        loadTable()
    };



    // this is some stuff to handle the lazy load / infinite scroll
    $scope.barLimit = 5;
    $scope.increaseLimit = function() {
        $scope.barLimit += 5;
        console.log('Increase Bar Limit', $scope.barLimit)
    };



    // select item in table and pass it to the document-view (template)
    $scope.selectDocument = function(item) {

        console.log("Select item in table and pass it to the doc view ...");

        var paramA = $scope.myDropDown;
        var route = '/dashboard/document/' + item._id.$oid;
        console.log(item._id.$oid);

        // this is the redirection to the document-view, we send the doc ID and the name of the current topic
        $location.path(route).search({paramA: $scope.myDropDown})
    };

    //$scope.newTopicTitle = $scope.myDropDown;


});

