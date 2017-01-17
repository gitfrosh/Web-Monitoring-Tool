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


class UserbyIDNewQuery(Resource):
    # put new query in user's topic

    def put(self, userId):

        from app import mongo

        parser = reqparse.RequestParser()
        parser.add_argument('query.id', type=str, required=True, help='No query id given',
                            location='json')
        parser.add_argument('topic.title', type=str, required=True, help='No topic title given',
                            location='json')
        request_params = parser.parse_args()

        #result = mongo.db.users.update({'_id': ObjectId(userId), "topics.title": request_params['topic.title']}, {
        #    '$push': {"topics.$.querys": {ObjectId(request_params['query.id'])}}})

        result = mongo.db.users.update(
            {'_id': ObjectId(userId), "topics.title": request_params['topic.title']},
            {"$push":
                {"topics.$.querys":
                     ObjectId(request_params['query.id']),
                }
            }
        )

        response = {
            'result1': result,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized


class UserbyIdTopic(Resource):
    # put new topic or edit it in user's JSON

    def put(self, userId):

        from app import mongo
        parser = reqparse.RequestParser()
        parser.add_argument('topic.status', type=str, required=True, help='No topic status given',
                            location='json')
        parser.add_argument('topic.collaboration', type=str, required=True, help='No collaborationMode given',
                            location='json')
        parser.add_argument('topic.owner', type=str, required=True, help='No owner given',
                            location='json')
        parser.add_argument('topic.title', type=str, required=True, help='No title given',
                            location='json')
        parser.add_argument('oldtopic.title', type=str, required=False, help='No oldtitle given',
                            location='json')
        #parser.add_argument('topic.querys', type=list, required=False, help='No querys given',
        #                    location='json')
        request_params = parser.parse_args()

        # unfortunately, we have to do two requests here: one, to delete ("pull") the existing topic for a specific user
        # the second to add/rea-dd (push) the topic, the user has just created/modified

        result1 = mongo.db.users.update({'_id': ObjectId(userId)},
                                            {'$pull': {'topics': {'title': request_params['oldtopic.title']}}})
        result2 = mongo.db.users.update({'_id': ObjectId(userId)}, {
            '$push': {"topics": {"active": request_params['topic.status'], "collaboration": request_params['topic.collaboration'],
                                 "owner": ObjectId(request_params['topic.owner']), "querys": [], "title": request_params['topic.title']}}},
                                            upsert=True)
        #result3 = mongo.db.users.update({'_id': ObjectId(userId), "topics.title": request_params['topic.title']}, {
        #    '$push': {"topics.$.querys": request_params['topic.querys']}},
        #                               upsert=True)

        response = {
            'result1': result1,
            'result2': result2,
          #  'result3': result3,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized




