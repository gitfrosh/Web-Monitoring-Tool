/**
 * Created by ulrike on 17.01.17.
 */

// ///////////////////////////////////////////////Factories


// static/js/factories/apiFactory.js

myApp.factory('Api', ['$resource',
    function($resource) {

        return {
            User: $resource('/api/users/:id', {
                    id: '@id',
                    method: "GET"
                }),
            NewQuery: $resource('/api/querys', {}, {
                save: {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    id: '@id'
                        //data: Body of request is sent through Controller
                }
                })
            // more resources ..
        };
    }
]);