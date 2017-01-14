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

class AllDocuments(Resource):

    # get ALL documents # only for dev purposes
    def get(self):
        data = []

        from app import mongo

        # ObjectID cannot be JSONified, so it's always zero
        cursor = mongo.db.documents.find({})

        for document in cursor:
            data.append(document)

        return json.loads(json_util.dumps({"DOCUMENTS": data}))

    # add documents (this is the actual web monitoring flow
    def post(self):
         # do something
         return

class DocumentsByQuery(Resource):

    # find specific documents depending on connected querys
    def get(self, queryId):

        data = []

        from app import mongo

        cursor = mongo.db.documents.find({"querys": { "$in": [ObjectId(queryId)]}} )

        for document in cursor:
            data.append(document)

        return json.loads(json_util.dumps({"DOCUMENTS": data}))


class DocumentbyID(Resource):
    # find specific document depending on ID

    def get(self, documentId):
        data = []

        from app import mongo

        data = mongo.db.documents.find_one({'_id': ObjectId(documentId)})

        data_sanitized = json.loads(json_util.dumps(data))

        return ({"DOCUMENT": data_sanitized})

    def put(self, documentId):
        # update document data here

        from app import mongo

        data = mongo.db.documents.find_one({'_id': ObjectId(documentId)})

        data_sanitized = json.loads(json_util.dumps(data))

        return ({"DOCUMENT": data_sanitized})

class DocumentbyIDUserComment(Resource):

    def put(self, documentId):
        from app import mongo
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str, required=True, help = 'No userId given', location='json' ) # try without location
        parser.add_argument('commentText', type=str, required = True, help = 'No commentText given', location = 'json') # try without location & action
        request_params = parser.parse_args()
        #result = process_the_request(request_params)

        result = mongo.db.documents.update({'_id': ObjectId(documentId) }, { '$push': {"comments": {"c_user": request_params['userId'], "text": request_params['commentText']}}})

        response = {
             'result': result,
             'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized

    def delete(self):
        # well... not priority! # but it should be possible to delete comments...
        return



class DocumentbyIDUserTag(Resource):

    def put(self):
        return

    def delete(self):
        # well... not priority! # but it should be possible to delete user-tags...
        return


class DocumentbyIDUserBookmark(Resource):

    def put(self):
        return

class DocumentbyIDSource(Resource):

    def put(self):
        return
