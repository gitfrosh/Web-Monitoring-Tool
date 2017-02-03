'use strict';

// ///////////////////////////////////////////////Module

var myApp = angular.module('myApp', [
    'infiniteScroll', 'sharedServices','testFactory','ngRoute', 'ngResource', 'angular.filter'
]);


// ///////////////////////////////////////////////Constants


myApp.constant("loggedInUser", {
    "userId": "587e0445490b8e64935f305d"
});

// ///////////////////////////////////////////////Values


myApp.value('THROTTLE_MILLISECONDS', null);


// ///////////////////////////////////////////////Configuration


myApp.config(['$routeProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/', {
            controller: 'StartCtrl',
            templateUrl: '../static/partials/start.html',
        }).
        when('/topic', {
            controller: 'TopicCtrl',
            templateUrl: '../static/partials/topic-view.html',
        }).
         when('/newTopic', {
            controller: 'NewTopicCtrl',
            templateUrl: '../static/partials/new-topic.html',
        }).
         when('/editTopic', {
            controller: 'EditTopicCtrl',
            templateUrl: '../static/partials/edit-topic.html',
        }).
        when('/document/:itemId', {
            controller: 'DocumentCtrl',
            templateUrl: '../static/partials/document-view.html',
        }).
        when('/newsletter', {
            templateUrl: '../static/partials/newsletter.html',
        }).
        when('/userconfig', {
            templateUrl: '../static/partials/user-config.html',
        }).
        when('/usersources', {
            templateUrl: '../static/partials/user-sources.html',
        }).
        when('/logout', {
            controller: 'Logout'
        }).
        otherwise({
            redirectTo: '/'
        })

        ;
    }
]);


//////////////

myApp.directive('modal', function(){
        return {
            template: '<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content" ng-transclude><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">Modal title</h4></div></div></div></div>',
            restrict: 'E',
            transclude: true,
            replace:true,
            scope:{visible:'=', onSown:'&', onHide:'&'},
            link:function postLink(scope, element, attrs){

                $(element).modal({
                    show: false,
                    keyboard: attrs.keyboard,
                    backdrop: attrs.backdrop
                });

                scope.$watch(function(){return scope.visible;}, function(value){

                    if(value == true){
                        $(element).modal('show');
                    }else{
                        $(element).modal('hide');
                    }
                });

                $(element).on('shown.bs.modal', function(){
                  scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                  });
                });

                $(element).on('shown.bs.modal', function(){
                  scope.$apply(function(){
                      scope.onSown({});
                  });
                });

                $(element).on('hidden.bs.modal', function(){
                  scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                  });
                });

                $(element).on('hidden.bs.modal', function(){
                  scope.$apply(function(){
                      scope.onHide({});
                  });
                });
            }
        };
    }
);

myApp.directive('modalHeader', function(){
    return {
        template:'<div class="modal-header alert alert-danger"<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button><span class="glyphicon glyphicon-exclamation-sign modal-title"> {{title}}</span></div>',
        replace:true,
        restrict: 'E',
        scope: {title:'@'}
    };
});

myApp.directive('modalHeaderSuccess', function(){
    return {
        template:'<div class="modal-header-success alert alert-success"<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button><span class="glyphicon glyphicon-ok modal-title"> {{title}}</span></div>',
        replace:true,
        restrict: 'E',
        scope: {title:'@'}
    };
});



myApp.directive('modalBody', function(){
    return {
        template:'<div class="modal-body" ng-transclude></div>',
        replace:true,
        restrict: 'E',
        transclude: true
    };
});

myApp.directive('modalFooter', function() {
    return {
        template: '<div class="modal-footer" ng-transclude></div>',
        replace: true,
        restrict: 'E',
        transclude: true
    };
});