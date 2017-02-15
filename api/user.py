import bcrypt
import pymongo
from bson import ObjectId
from flask import json, jsonify, session
from flask_restful import reqparse, abort, Api, Resource
from bson import json_util, ObjectId
import json
from pymongo import errors


#CRUD Operations:
#Create (POST) - Make something
#Read (GET)_- Get something
#Update (PUT) - Change something
#Delete (DELETE)- Remove something

salt = bcrypt.gensalt()

class NewUser(Resource):
    def post(self):

        from app import mongo
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='No email activeness given',
                            location='json')
        parser.add_argument('name', type=str, required=True, help='No name given',
                            location='json')
        parser.add_argument('password', type=str, required=True, help='No pw given',
                            location='json')
        request_params = parser.parse_args()

        result1 = ""
        result2 = {}

        try:

            hashed = bcrypt.hashpw(request_params['password'].encode('utf8'), bcrypt.gensalt())


            result1 = mongo.db.users.insert({
                "email": request_params['email'],
                "name": request_params['name'],
                "password": hashed,
                "sources": "",
                "topics": []
            })

        except pymongo.errors.DuplicateKeyError as e:

            result2['success'] = False
            result2['error'] = ("This document's title already exists. Document was not inserted into db.")

        # create an index everytime a new doc was inserted, to prevent duplicate entries regarding title!!
        # we could prevent duplicate entries also through unify the url or other metadata..
        result3 = mongo.db.documents.create_index([('title', pymongo.ASCENDING)], unique=True)

        response = {
            'result': True,
            'result1': result1,
            'result2': result2,
            'result3': result3,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized


class LogoutUser(Resource):
    def get(self):
        session.pop('logged_in', None)
        session.pop('userId', None)
        return jsonify({'result': 'success'})


class UserStatus(Resource):
    def get(self):

        if session.get('logged_in'):
            if session['logged_in']:
                userId_sanitized = json.loads(json_util.dumps(session['userId']))
                return jsonify({'status': True}, {'userId': userId_sanitized['$oid']})

            #userId_sanitized['$oid']

        else:
            return jsonify({'status': False}, {'userId': ""})


class VerifyUser(Resource):

    def post(self):
        from app import mongo

        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help='No email given',
                            location='json')
        parser.add_argument('password', type=str, required=True, help='No password given',
                            location='json')

        request_params = parser.parse_args()

        data = {}
        userId = ""

        data = mongo.db.users.find_one({'email': request_params['email']})

        auth = False

        #hashed_password = bcrypt.hashpw(password, salt)

        if data:
            auth = bcrypt.checkpw(request_params['password'].encode('utf8'), data['password'])


        if auth:
            session['userId'] = json.loads(json_util.dumps(ObjectId(data['_id'])))
            session['logged_in'] = True
            status = True
            userId = ObjectId(data['_id'])


        else:
            status = False

        userId_sanitized = json.loads(json_util.dumps(userId))
        return jsonify({'result': status}, {"userId": userId_sanitized['$oid']})


class User(Resource):



    def get(self, userId):

        from app import mongo

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




