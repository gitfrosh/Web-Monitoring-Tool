/**
 * Created by ulrike on 17.01.17.
 */


var sharedServices= angular.module('sharedServices',[]);

sharedServices.factory('QueryObjectFactory', function(Api){

    _queryId = "";
    queryObject = {};

  return {

        setQueryId: function (queryId) {
            _queryId = queryId;
        },

          

        getQueryObject: function () {

            console.log(_queryId);
            // NOOOOOOOOOOO ASYNCH TASK HERE!!
              var promise = Api.QuerybyId.get({
                  id: _queryId

              }); promise.then(function (data) {
                  queryObject = data;

              }); return queryObject
        }

    };

});



// how to use this:
// TestFactory.setQueryId("587236671eb3a4f927da77da");
//        console.log(TestFactory.getQueryObject());





sharedServices.factory('UserObjectFactory', function(Api){

    _userObject = "";
    _dropdown ="";

    userTopics = [];
    userTopicTitles = [];

    selTopic = {};
    selTopicQuerys = [];



  return {

        setUserObject: function (userObject) {
            _userObject = userObject;
        },

        setDropdown: function (dropdown) {
            _dropdown = dropdown;
        },


        getTopics: function () {

        userTopics = _userObject.USER.topics;
        return userTopics

  },
        getTopicTitles: function () {
        userTopicTitles = [];

        // put the topics' titles in an array
        for (var i = 0, l = userTopics.length; i < l; i++) {
            userTopicTitles.push(userTopics[i].title);
        }

        return userTopicTitles

  },   getselTopic: function () {

        selTopic = _.find(userTopics, function(item) {
            return item.title === _dropdown;
        }); return selTopic


      },

        getSelTopicQuerys: function () {

        selTopicQuerys = selTopic.querys;
            return selTopicQuerys

      }





  }});

