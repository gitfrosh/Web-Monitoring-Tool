/**
 * Created by ulrike on 17.01.17.
 */



myApp.controller('TopicCtrl', function($scope, Api, QueryObjectFactory, UserObjectFactory, TestFactory, $location, loggedInUser) {

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
    $scope.documentCollection = [];
    $scope.documentCollection.empty = false;

    // stuff to handle the documents' table: sort, search
    $scope.sortType = 'title'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.searchDoc   = '';     // set the default search/filter term


    initiateView();


    function initiateView() {

        $scope.usertopics = [];
    $scope.usertopictitles = [];
         $scope.selectedTopic = {};
    $scope.selectedTopic.querys = [];


        // also used i startController ---->>>> REDUNDANCE
         Api.User.get({
        id: loggedInUser.userId
     }, function(data) {
        console.log("Load current user data and his topics ...");
        $scope.user = data;

        UserObjectFactory.setUserObject($scope.user);
        $scope.usertopics = UserObjectFactory.getTopics();
        $scope.usertopictitles = UserObjectFactory.getTopicTitles();


        if ($scope.myDropDown) { // if a topic was selected...
            console.log("Lade Topic view with topic " + $scope.myDropDown); // on first initiate this is empty!

            UserObjectFactory.setDropdown($scope.myDropDown);
            $scope.selectedTopic = UserObjectFactory.getselTopic();
            $scope.iDsOfquerysForSelectedTopic = UserObjectFactory.getSelTopicQuerys();

            loadTable(); // ... load table
            loadQuerys()

        } else { //... else do nothing
            console.log("No topic selected");

        }
             });

    }

   


      $scope.editTopic = function() {
        console.log("Clicked Edit Topic!");


          $scope.checkboxStatus = {};
          $scope.editTopicStatus = true;
          $scope.documentCollection = [];

          $scope.checkboxStatus.active = $scope.selectedTopic.active == "True";
          $scope.checkboxStatus.collab = $scope.selectedTopic.collaboration == "True";


        var paramA = $scope.myDropDown;
        var route = '/editTopic/';

        // this is the redirection to the edit-topic view, we send the topic name
        $location.path(route).search({paramA: paramA});



    };


    function loadQuerys() {

           /////////////!!!DRY!!! also in editTopic/////////////////////////////////////////////////////////////////////


         // now that we know the query IDs we must find the querys' objects

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

                  console.log($scope.queryObjects);
              })

          }

          } else if (!$scope.iDsOfquerysForSelectedTopic.length) {
              console.log("There are no querys to retrieve.")
          }


    }
    
    function loadTable() {

        console.log("Load Table with documents for Topic" +  $scope.selectedTopic.title);

        // start a fresh documentCollection for our output table
        $scope.documentCollection = [];
        console.log($scope.documentCollection);

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

                    $scope.items = $scope.documentCollection;

                    // this is some stuff to handle the lazy load / infinite scroll
            $scope.barLimit = 10;
            $scope.increaseLimit = function() {
            $scope.barLimit += 2;

                //$scope.documentCollection.empty = false;

    };



            })
        }

        } else {
            console.log("There are no querys/documents that can be retrieved");
            $scope.documentCollection.empty = false;
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

                        console.log($scope.rawDocumentCollection[i].bookmarks[a].b_user.$oid);
                        console.log($scope.rawDocumentCollection[i].bookmarks[a].status);

                            $scope.documentCollection.push($scope.rawDocumentCollection[i]);
                            console.log($scope.rawDocumentCollection[i]);
                            console.log($scope.documentCollection);
                            $scope.documentCollection.empty = false;


                    } else {
                            console.log("Dieses Dokument hat keine Bookmarks.");
                            //$scope.documentCollection.empty = true; does not really work //todo

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




    // select item in table and pass it to the document-view (template)
    $scope.selectDocument = function(item) {

        console.log("Select item in table and pass it to the doc view ...");

        var paramA = $scope.myDropDown;
        var route = '/document/' + item._id.$oid;
        console.log(item._id.$oid);

        // this is the redirection to the document-view, we send the doc ID and the name of the current topic
        $location.path(route).search({paramA: $scope.myDropDown})
    };




});


