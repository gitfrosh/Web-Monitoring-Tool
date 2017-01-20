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

        return

class DocumentbyIDUserComment(Resource):

    def put(self, documentId):
        from app import mongo
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str, required=True, help = 'No userId given', location='json' ) # try without location
        parser.add_argument('commentText', type=str, required = True, help = 'No commentText given', location = 'json') # try without location & action
        request_params = parser.parse_args()
        #result = process_the_request(request_params)

        result = mongo.db.documents.update({'_id': ObjectId(documentId) }, { '$push': {"comments": {"c_user": ObjectId(request_params['userId']), "text": request_params['commentText']}}})

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
    def put(self, documentId):

        from app import mongo
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str, required=True, help='No userId given',
                            location='json')
        parser.add_argument('bookmarkStatus', type=str, required=True, help='No bookmarkStatus given',
                            location='json')  # try without location & action
        request_params = parser.parse_args()
        # result = process_the_request(request_params)

        # unfortunately, we have to do two requests here: one, to delete ("pull") the existing bookmark for a specific user
        # the second to add (push) the bookmark, the user has just chosen

        result1 = mongo.db.documents.update({'_id': ObjectId(documentId)}, { '$pull': {'bookmarks': {'b_user': ObjectId(request_params['userId'])}}})
        result2 = mongo.db.documents.update({'_id': ObjectId(documentId)}, {
           '$push': {"bookmarks": {"b_user": ObjectId(request_params['userId']), "status": request_params['bookmarkStatus']}}}, upsert=True)

        response = {
            'result1': result1,
            'result2': result2,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized

class DocumentbyIDSource(Resource):

    def put(self):
        return


class NewDocument(Resource):

    def post(self):
        from app import mongo

        parser = reqparse.RequestParser()
        parser.add_argument('title', type=str, required=True, help='No title given',
                            location='json')
        parser.add_argument('description', type=str, required=False, help='No abstract given',
                            location='json')
        parser.add_argument('publishedAt', type=str, required=True, help='No publishedAt given',
                            location='json')
        parser.add_argument('url', type=str, required=True, help='No user given',
                            location='json') # maybe later
        request_params = parser.parse_args()
        ###result = process_the_request(request_params)

        #dmongo.db.documents.insert_many([{'i': i} for i in range(10000)]).inserted_ids

        # for i in dict(parser):

        result = mongo.db.documents.insert({
            "abstract": request_params['description'],
            "bookmarks": [],
            "comments": [],
            "date": request_params['publishedAt'],
            "querys": [],
            "related_docs": [],
            "sources": {
                "quellenab": [],
                "quellenunab": False
            },
            "super_doc": "",
            "tags_system": [],
            "tags_user": [],
            "title": request_params['title'],
            "url": request_params['url']
        })

        response = {
            'result': result,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized
