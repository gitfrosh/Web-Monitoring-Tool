'use strict';

// ///////////////////////////////////////////////Module

var myApp = angular.module('myApp', [
    'ngRoute', 'ngResource'
]);



// ///////////////////////////////////////////////Factories

myApp.factory('Api', ['$resource',
    function($resource) {
        return {
            Document: $resource('/api/documents/:query', {
                query: '@query',
                method: "GET"
            }),
            DocumentbyId: $resource('/api/document/:id', {
                id: '@id',
                method: "GET"
            }),
            User: $resource('/api/users/:id', {
                id: '@id',
                method: "GET"
            })

        };
    }
]);



// ///////////////////////////////////////////////Controllers


//////////////////Controller: UserLoginCtrl
myApp.controller('UserLoginCtrl', function($scope, Api, loggedInUser) {
    // Get specific User, curently only used for Hello-Statement in top bar
    Api.User.get({
        id: loggedInUser.userId
    }, function(data) {
        $scope.user = data;
    });

});

//////////////////Controller: UserCtrl
myApp.controller('UserCtrl', function($scope, Api, $location, loggedInUser) {
    // this controller is actually too big and complex

    // Get all users
    Api.User.query(function(data) {
        $scope.users = data.users;
    });

    // Our form data for creating a new User with ng-model
    $scope.postData = {};
    $scope.newUser = function() {
        var user = new Api.User($scope.postData);
        user.$save();
    };

    // Get specific User with the following Id ... (hardcoded, see constant!!)
    // and save his topics (usertopics)
    // and save his usertopictitles (usertopictitles)

    Api.User.get({
        id: loggedInUser.userId
    }, function(data) {
        $scope.user = data;
        //console.log($scope.user);

        // now give only the user's topics
        $scope.usertopics = data.USER.topics;


        $scope.getContent = function(usertopics) {
            return usertopics.value + " " + obj.text;
        };


        // put the topics' titles in an array
        $scope.usertopictitles = [];


        for (var i = 0, l = $scope.usertopics.length; i < l; i++) {
            $scope.usertopictitles.push($scope.usertopics[i].title);

        }

        // default value of Dropdown: empty space for now
        $scope.myDropDown = "";


    });

    // actions to do on selected topic from Dropdown menu
    $scope.selectAction = function() {

        // here give only the user's topics' querys - so that matching documents can be retrieved
        $scope.querysForSelectedTopic = _.find($scope.usertopics, function(item) {
            return item.title === $scope.myDropDown;
        });

        // bind IDs of querys ...
        $scope.iDsOfquerysForSelectedTopic = $scope.querysForSelectedTopic.querys;


        // for every saved query-ID find connected documents
        for (var i = 0, l = $scope.iDsOfquerysForSelectedTopic.length; i < l; i++) {

            console.log($scope.iDsOfquerysForSelectedTopic[i].$oid);

            // start a fresh documentCollection for our output table
            $scope.documentCollection = [];
            console.log($scope.documentCollection);

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
                }




            )
        }


        $scope.barLimit = 5;
        $scope.increaseLimit = function() {
            $scope.barLimit += 5;
            console.log('Increase Bar Limit', $scope.barLimit)
        }



    };

    // select item in table and pass it to the document-view (template)
    $scope.selectDocument = function(item) {
        var route = '/dashboard/document/' + item._id.$oid;
        console.log(item._id.$oid);
        $location.path(route);
    };
});



//////////////////Controller: DocumentCtrl
myApp.controller('DocumentCtrl', ['$scope', '$routeParams', 'Api', 'loggedInUser', function($scope, $routeParams, Api, loggedInUser) {
    var param = $routeParams.itemId;
    console.log(param);
    var userId = loggedInUser.userId;



    // get the specific document and all its content
    Api.DocumentbyId.get({
        id: param

    }, function(data) {
        $scope.document = data;

        // get comments of the logged in user
        // first, get all comments (can be re-used in collaboration mode)
        $scope.allComments = [];
        $scope.userComments = [];
        $scope.allComments = $scope.document.DOCUMENT.comments;

        // push all comments of specific user in array
        for (var i = 0, l = $scope.allComments.length; i < l; i++) {

            if ($scope.allComments[i].c_user == userId) {

                $scope.userComments.push($scope.allComments[i].text);
                console.log($scope.userComments);
            }


        }

        // get bookmarks of the logged in user
        // first, get all bookmarks
        $scope.allBookmarks = [];
        $scope.userBookmark = [];
        $scope.userBookmark.status = false; // default
        $scope.allBookmarks = $scope.document.DOCUMENT.bookmarks;

        // and set the comment area off for now
        $scope.commentAreaToggledOn = false;

        // push all Bookmarks of specific user in array
        for (var a = 0, le = $scope.allBookmarks.length; a < le; a++) {

            if ($scope.allBookmarks[a].b_user == userId) {

                    // initiate the marked icon (star) in view
                    $scope.initButtons = function(){
                          $scope.userBookmark.status = true;
                          $scope.commentAreaToggledOn = false;
                          console.log($scope.userBookmark.status);
                };

            }


        }

    });



      // react on click on icon star in view
      $scope.changeBookmark = function(){
              $scope.userBookmark.status = !$scope.userBookmark.status;
          console.log($scope.userBookmark.status);
            };

      // toggle comment area on and off
      $scope.toggleCommentArea = function(){
              $scope.commentAreaToggledOn = !$scope.commentAreaToggledOn;
              console.log($scope.commentAreaToggledOn);
            };

      // Tag form process
      $scope.submitTagForm = function() {
          console.log($scope.newTag);
          console.log(userId);


      };


           // Comment form process
      $scope.submitCommentForm = function() {
          console.log($scope.newComment); // doesn't work --- really strange!!!!!!!!!!!!!!!!!!!!!!!
          //https://github.com/angular/angular.js/issues/6038
          console.log(userId);

      };






}]);

// ///////////////////////////////////////////////Constants


myApp.constant("loggedInUser", {
    "userId": "5873de1dae29a94ff4c2edde"
});


// ///////////////////////////////////////////////Configuration


myApp.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/', {
            redirectTo: '/dashboard/'
        }).
        when('/dashboard', {
            // Show elements depending on user details:
            // Does user have any topics saved?
            // get uUser topics in array from DB
            // show the first (if available), and fill in site elements

            controller: 'UserCtrl',
            templateUrl: '../static/partials/topic-view.html',
        }).
        when('/dashboard/document/:itemId', {
            controller: 'DocumentCtrl',
            templateUrl: '../static/partials/document-view.html',
        }).
        when('/dashboard/newsletter', {
            templateUrl: '../static/partials/newsletter.html',
        }).
        when('/dashboard/userconfig', {
            templateUrl: '../static/partials/user-config.html',
        }).
        when('/dashboard/usersources', {
            templateUrl: '../static/partials/user-sources.html',
        }).
        when('/dashboard/logout', {
            controller: 'Logout'
        }).
        otherwise({
            redirectTo: '/dashboard/'
        })

        ;
    }
]);

// ///////////////////////////////////////////////Values


myApp.value('THROTTLE_MILLISECONDS', null);


// ///////////////////////////////////////////////Directives

myApp.directive('infiniteScroll', [
    '$rootScope', '$window', '$interval', 'THROTTLE_MILLISECONDS',
    function($rootScope, $window, $interval, THROTTLE_MILLISECONDS) {
        return {
            scope: {
                infiniteScroll: '&',
                infiniteScrollContainer: '=',
                infiniteScrollDistance: '=',
                infiniteScrollDisabled: '=',
                infiniteScrollUseDocumentBottom: '=',
                infiniteScrollListenForEvent: '@'
            },
            link: function(scope, elem, attrs) {
                var changeContainer, checkWhenEnabled, container, handleInfiniteScrollContainer, handleInfiniteScrollDisabled, handleInfiniteScrollDistance, handleInfiniteScrollUseDocumentBottom, handler, height, immediateCheck, offsetTop, pageYOffset, scrollDistance, scrollEnabled, throttle, unregisterEventListener, useDocumentBottom, windowElement;
                windowElement = angular.element($window);
                scrollDistance = null;
                scrollEnabled = null;
                checkWhenEnabled = null;
                container = null;
                immediateCheck = true;
                useDocumentBottom = false;
                unregisterEventListener = null;
                height = function(elem) {
                    elem = elem[0] || elem;
                    if (isNaN(elem.offsetHeight)) {
                        return elem.document.documentElement.clientHeight;
                    } else {
                        return elem.offsetHeight;
                    }
                };
                offsetTop = function(elem) {
                    if (!elem[0].getBoundingClientRect || elem.css('none')) {
                        return;
                    }
                    return elem[0].getBoundingClientRect().top + pageYOffset(elem);
                };
                pageYOffset = function(elem) {
                    elem = elem[0] || elem;
                    if (isNaN(window.pageYOffset)) {
                        return elem.document.documentElement.scrollTop;
                    } else {
                        return elem.ownerDocument.defaultView.pageYOffset;
                    }
                };
                handler = function() {
                    var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
                    if (container === windowElement) {
                        containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
                        elementBottom = offsetTop(elem) + height(elem);
                    } else {
                        containerBottom = height(container);
                        containerTopOffset = 0;
                        if (offsetTop(container) !== void 0) {
                            containerTopOffset = offsetTop(container);
                        }
                        elementBottom = offsetTop(elem) - containerTopOffset + height(elem);
                    }
                    if (useDocumentBottom) {
                        elementBottom = height((elem[0].ownerDocument || elem[0].document).documentElement);
                    }
                    remaining = elementBottom - containerBottom;
                    shouldScroll = remaining <= height(container) * scrollDistance + 1;
                    if (shouldScroll) {
                        checkWhenEnabled = true;
                        if (scrollEnabled) {
                            if (scope.$$phase || $rootScope.$$phase) {
                                return scope.infiniteScroll();
                            } else {
                                return scope.$apply(scope.infiniteScroll);
                            }
                        }
                    } else {
                        return checkWhenEnabled = false;
                    }
                };
                throttle = function(func, wait) {
                    var later, previous, timeout;
                    timeout = null;
                    previous = 0;
                    later = function() {
                        var context;
                        previous = new Date().getTime();
                        $interval.cancel(timeout);
                        timeout = null;
                        func.call();
                        return context = null;
                    };
                    return function() {
                        var now, remaining;
                        now = new Date().getTime();
                        remaining = wait - (now - previous);
                        if (remaining <= 0) {
                            clearTimeout(timeout);
                            $interval.cancel(timeout);
                            timeout = null;
                            previous = now;
                            return func.call();
                        } else {
                            if (!timeout) {
                                return timeout = $interval(later, remaining, 1);
                            }
                        }
                    };
                };
                if (THROTTLE_MILLISECONDS != null) {
                    handler = throttle(handler, THROTTLE_MILLISECONDS);
                }
                scope.$on('$destroy', function() {
                    container.unbind('scroll', handler);
                    if (unregisterEventListener != null) {
                        unregisterEventListener();
                        return unregisterEventListener = null;
                    }
                });
                handleInfiniteScrollDistance = function(v) {
                    return scrollDistance = parseFloat(v) || 0;
                };
                scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
                handleInfiniteScrollDistance(scope.infiniteScrollDistance);
                handleInfiniteScrollDisabled = function(v) {
                    scrollEnabled = !v;
                    if (scrollEnabled && checkWhenEnabled) {
                        checkWhenEnabled = false;
                        return handler();
                    }
                };
                scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
                handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);
                handleInfiniteScrollUseDocumentBottom = function(v) {
                    return useDocumentBottom = v;
                };
                scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
                handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);
                changeContainer = function(newContainer) {
                    if (container != null) {
                        container.unbind('scroll', handler);
                    }
                    container = newContainer;
                    if (newContainer != null) {
                        return container.bind('scroll', handler);
                    }
                };
                changeContainer(windowElement);
                if (scope.infiniteScrollListenForEvent) {
                    unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
                }
                handleInfiniteScrollContainer = function(newContainer) {
                    if ((newContainer == null) || newContainer.length === 0) {
                        return;
                    }
                    if (newContainer instanceof HTMLElement) {
                        newContainer = angular.element(newContainer);
                    } else if (typeof newContainer.append === 'function') {
                        newContainer = angular.element(newContainer[newContainer.length - 1]);
                    } else if (typeof newContainer === 'string') {
                        newContainer = angular.element(document.querySelector(newContainer));
                    }
                    if (newContainer != null) {
                        return changeContainer(newContainer);
                    } else {
                        throw new Exception("invalid infinite-scroll-container attribute.");
                    }
                };
                scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
                handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);
                if (attrs.infiniteScrollParent != null) {
                    changeContainer(angular.element(elem.parent()));
                }
                if (attrs.infiniteScrollImmediateCheck != null) {
                    immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
                }
                return $interval((function() {
                    if (immediateCheck) {
                        return handler();
                    }
                }), 0, 1);
            }
        };
    }
]);