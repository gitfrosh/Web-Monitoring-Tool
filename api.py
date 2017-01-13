from bson import ObjectId
from flask import json, jsonify
from flask_restful import reqparse, abort, Api, Resource
from bson import json_util, ObjectId
import json

class User(Resource):

    def get(self, userId):
        data = []
        from app import mongo

        # as long as there is no authentification process, userid is just hardcoded!
        # use userid to find specific user

        # we must "sanitize" the returned BSON when jsonifying it, because otherwise there will be a TypeError due to
        # the ObjectIds!
        data = mongo.db.users.find_one({'_id': ObjectId(userId)})
        data_sanitized = json.loads(json_util.dumps(data))

        return ({"USER": data_sanitized})

    def delete(self, userid):
        # do something
        return

    def put(self, userid):
        # do something
        return


class Users(Resource):

    def get(self):
        data = []
        from app import mongo

        # find all users

        cursor = mongo.db.users.find({})#.limit(10)

        for user in cursor:
            data.append(user)

        return json.loads(json_util.dumps({"USER": data}))



    def post(self):
        # do something
        return


class Documents(Resource):

    # get ALL documents
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

class Document(Resource):

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





