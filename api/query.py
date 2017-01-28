from bson import ObjectId
from flask import json, jsonify
from flask_restful import reqparse, abort, Api, Resource
from bson import json_util, ObjectId
import json

#CRUD Operations:
#Create (POST) - Make something
#Read (GET)_- Get something
#Update (PUT) - Change something
#Delete (DELETE)- Remove something

# have the API return the updated (or created) representation as part of the response.
# In case of a POST that resulted in a creation, use a HTTP 201 status code and include a Location header
# that points to the URL of the new resource.

class Query(Resource):

    def get(self, queryId):
        data = []
        from app import mongo

        data = mongo.db.querys.find_one({'_id': ObjectId(queryId)})
        data_sanitized = json.loads(json_util.dumps(data))

        return ({"QUERY": data_sanitized})

    def post(self):
            return

class NewQuery(Resource):

    def post(self):
        from app import mongo
        parser = reqparse.RequestParser()
        parser.add_argument('status.active', type=str, required=True, help='No status activeness given',
                            location='json')
        parser.add_argument('status.user', type=str, required=True, help='No user given',
                            location='json')
        parser.add_argument('term', type=str, required=True, help='No term given',
                            location='json')
        #parser.add_argument('suggestions', type=str, required=True, help='No user given',
        #                    location='json') # maybe later
        request_params = parser.parse_args()
        # result = process_the_request(request_params)

        result = mongo.db.querys.insert({
                        "status": [
                                 {
                                    "active": request_params['status.active'],
                                    "user": ObjectId(request_params['status.user'])
                                  }
                                    ],
                                "suggestions": [],
                                "term": request_params['term']
                                    })
        response = {
            'result': result,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized


class AllQuerys(Resource):

    def get(self):
        data = []
        from app import mongo

        cursor = mongo.db.querys.find({})

        for query in cursor:
            data.append(query)

        return json.loads(json_util.dumps({"QUERYS": data}))



class QuerybyIDStatus(Resource):

    def put(self, queryId):
        from app import mongo

        parser = reqparse.RequestParser()
        parser.add_argument('query.status', type=str, required=True, help='No query status given',
                            location='json')
        parser.add_argument('query.user', type=str, required=True, help='No user id given',
                            location='json')
        request_params = parser.parse_args()

        result1 = mongo.db.querys.update({'_id': ObjectId(queryId)},
                                        {'$pull': {'status': {'user': ObjectId(request_params['query.user'])}}})

        result2 = mongo.db.querys.update({'_id': ObjectId(queryId)}, {
           '$push': {"status": {"user": ObjectId(request_params['query.user']), "active": request_params['query.status']}}}, upsert=True)

        response = {
            'result1': result1,
            'result2': result2,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized