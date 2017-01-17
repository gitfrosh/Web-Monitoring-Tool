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
             // get the query's names here...
              Api.QuerybyId.get({
                  id: _queryId

              }, function (data) {
                  queryObject = data;
                  
              }); return queryObject
        }

    };

});