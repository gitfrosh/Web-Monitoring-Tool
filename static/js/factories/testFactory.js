/**
 * Created by ulrike on 17.01.17.
 */

angular.module('testFactory', [])
.factory('TestFactory', function(Api) {
    
    _queryId = "";
    queryObject = {};
    
  return {
      
        setQueryId: function (queryId) {
            _queryId = queryId;
        },  
      
      
        getQueryObject: function ($scope) {

            console.log(_queryId);

              Api.QuerybyId.get({
                  id: _queryId

              }, function (data) {
                  queryObject = data;
                  
              }); return queryObject
        }

    };

});

// how to use this:
// TestFactory.setQueryId("587236671eb3a4f927da77da");
//        console.log(TestFactory.getQueryObject());