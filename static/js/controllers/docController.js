/**
 * Created by ulrike on 17.01.17.
 */


myApp.controller('DocumentCtrl', ['$scope', '$routeParams', 'Api', '$location', 'loggedInUser', function($scope, $routeParams, Api, $location, loggedInUser) {

    // we get the doc ID and the name of the current topic first, which were sent from topic view
    var param = $routeParams.itemId;
    var currentTopic = $location.search().paramA;

    var userId = loggedInUser.userId;

    // set the comment area off when loading the page
    $scope.commentAreaToggledOn = [];
    $scope.commentAreaToggledOn.status = false;



    //load document data (bookmarks, comments, tags ..)
    loadData();


    function loadData() {

        // set containers empty so that we can freshly reload the page if necessary
        $scope.allComments = [];
        $scope.userComments = [];
        $scope.allBookmarks = [];
        $scope.userBookmark = [];
        $scope.userBookmark.status = false; // default

        console.log("Loading data in doc view....");

        // danger! asynchonous task!
        var response = Api.DocumentbyId.get({
            id: param
        }, function() {
            console.log("GET item from server....");
        });

        response.$promise.then(function(data) {
            $scope.document = data; //

            console.log($scope.document);

            // get comments of the logged in user
            // first, get all comments (can be re-used in collaboration mode)

            $scope.allComments = $scope.document.DOCUMENT.comments;

            console.log($scope.allComments.length);


            // push all comments of specific user in array
            for (var i = 0, l = $scope.allComments.length; i < l; i++) {

                if ($scope.allComments[i].c_user.$oid == userId) {

                    $scope.userComments.push($scope.allComments[i].text);
                    console.log($scope.userComments);
                }


            }

            // get bookmarks of the logged in user
            // first, get all bookmarks

            $scope.allBookmarks = $scope.document.DOCUMENT.bookmarks;

            // remember the Bookmark of specific user
            for (var a = 0, le = $scope.allBookmarks.length; a < le; a++) {

                if ($scope.allBookmarks[a].b_user.$oid == userId) {

                    console.log($scope.allBookmarks[a].b_user.$oid);
                    console.log($scope.allBookmarks[a]);

                    if ($scope.allBookmarks[a].status == "True") {

                        console.log($scope.allBookmarks[a].status);

                        // initiate the marked icon (star) in view (overwrites the initiate-function!!

                        $scope.userBookmark.status = true;
                        console.log($scope.userBookmark.status);


                    } else {
                        console.log($scope.allBookmarks[a].status);

                    }



                }


            }



        });


    }


    // Some functions here...

    $scope. switchToTopicview = function () {

        console.log("Switch back to Topic view ...");

        // this is the redirection to the topic-view, we don't need to reassign paramA (current topic) cause it's still
        // available through "search()"
        $location.path('/topic');//.search({paramA: paramA})

    };

    // react on click on icon star in view
    $scope.changeBookmark = function() {
        console.log("Bookmark changed ...");
        $scope.userBookmark.status = !$scope.userBookmark.status;
        console.log($scope.userBookmark.status);

        var postData;
        postData = {
            "userId": userId,
            "bookmarkStatus": $scope.userBookmark.status
        };
        console.log(postData);

        // put comment on the server, WHEN FINISHED load data once more
        $scope.theNewBookmark = new Api.DocumentbyIDUserBookmark(postData);
        $scope.theNewBookmark.$update({
            id: param
        }).then(function() {
            loadData();
        });




    };

    // toggle comment area on and off
    $scope.toggleCommentArea = function() {
        $scope.commentAreaToggledOn.status = !$scope.commentAreaToggledOn.status;
        console.log($scope.commentAreaToggledOn.status);
    };

    // Tag form process
    $scope.submitTagForm = function() {
        console.log("Tag Form submitted ...");
        console.log($scope.newTag);
        console.log(userId);

        // todo


    };

    // Comment form process
    $scope.submitCommentForm = function() {
        console.log("Comment form submitted ...");
        console.log($scope.newComment); // does not work with ng-if!
        console.log(userId);

        var postData;
        postData = {
            "userId": userId,
            "commentText": $scope.newComment
        };
        console.log(postData);

        // put comment on the server, WHEN FINISHED load data once more
        $scope.theNewComment = new Api.DocumentbyIDUserComment(postData);
        $scope.theNewComment.$update({
            id: param
        }).then(function() {
            loadData();
            // form should be resetted here ...

        });



    };




}]);
