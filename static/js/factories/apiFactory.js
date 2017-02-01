/**
 * Created by ulrike on 17.01.17.
 */

// ///////////////////////////////////////////////Factories


/* static/js/factories/apiFactory.js */

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
            DocumentbyIDUserBookmark: $resource('/api/document/:id/newBookmark', {}, {
                update: {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    id: '@id'
                        //data: Body of request is sent through Controller
                }
            }),
            DocumentbyIDUserTag: $resource('/api/document/:id/newUserTag', {}, {
                update: {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    id: '@id'
                        //data: Body of request is sent through Controller
                }
            }),
            DocumentbyIDUserComment: $resource('/api/document/:id/newComment', {}, {
                update: {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    id: '@id'
                        //data: Body of request is sent through Controller
                }
            }),
            User: $resource('/api/users/:id', {
                    id: '@id',
                    method: "GET"
                }),
            QuerybyId: $resource('/api/query/:id', {
                    id: '@id',
                    method: "GET"
                }),
            QuerybyIDStatus: $resource('/api/query/:id/newStatus', {}, {
                update: {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    id: '@id'
                        //data: Body of request is sent through Controller
                }
                }),

            AllQuerys: $resource('/api/querys/', {
                   method: "GET"
                }),
            NewQuery: $resource('/api/querys', {}, {
                save: {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                            //data: Body of request is sent through Controller
                }
                }),

            UserbyIdTopic: $resource('/api/user/:id/topic', {}, {
                update: {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    id: '@id'
                        //data: Body of request is sent through Controller
                }
            }),
            UserbyIDNewQuery: $resource('/api/user/:id/newQuery', {}, {
                update: {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    id: '@id'
                        //data: Body of request is sent through Controller
                }
            })
        };
    }
]);


