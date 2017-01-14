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
        # we do not need to delete a user so far
        return

    def put(self, userid):
        # update user infos here
        return

    def post(self):
        # new user
        return


class AllUsers(Resource):
    # get all users # only for dev purposes

    def get(self):
        data = []
        from app import mongo


        cursor = mongo.db.users.find({})#.limit(10)

        for user in cursor:
            data.append(user)

        return json.loads(json_util.dumps({"USER": data}))


