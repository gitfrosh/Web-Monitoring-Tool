from bson import ObjectId
from flask import json, jsonify
from flask_restful import reqparse, abort, Api, Resource

class User(Resource):

    def get(self, userId):
        data = []
        from app import mongo

        # as long as there is no authentification process, userid is just hardcoded!
        # use userid to find specific user
        # ObjectID cannot be JSONified, so it's always zero
        # ObjectId('586f76939fc9577cc98eeea6')
        #cursor = mongo.db.users.find((ObjectId(ObjectId)))
        data = mongo.db.users.find_one({'_id': ObjectId(userId)}, {"_id": 0})

        #for user in cursor:
        #    data.append(user)
        return jsonify({"USER": data})

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
        # ObjectID cannot be JSONified, so it's always zero
        cursor = mongo.db.users.find({}, {"_id": 0, "update_time": 0}).limit(10)

        for user in cursor:
            data.append(user)

        return jsonify({"USER": data})

    def post(self):
        # do something
        return


class Documents(Resource):

    # get ALL documents
    def get(self):
        data = []

        from app import mongo

        # ObjectID cannot be JSONified, so it's always zero
        cursor = mongo.db.documents.find({}, {"_id": 0, "update_time": 0}).limit(10)

        for document in cursor:
            data.append(document)

        return jsonify({"DOCUMENTS": data})

    # add documents (this is the actual web monitoring flow
    def post(self):
         # do something
         return

class Document(Resource):

    # get documents dependend on querys
    def get(self):
        # do something
        return





