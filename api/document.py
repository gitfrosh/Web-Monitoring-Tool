#api/document.py

import pymongo
from flask import json
from flask_restful import reqparse, Resource
from bson import json_util, ObjectId
import json
from pymongo import errors

coll = "documents"


class AllDocuments(Resource):

    # get ALL documents # only for dev purposes
    def get(self):
        from app import mongo, conf

        data = []

        cursor = getattr(getattr(mongo, conf.CURSOR_DB), coll).find({})

        for document in cursor:
            data.append(document)

        return json.loads(json_util.dumps({"DOCUMENTS": data}))

class DocumentsByQuery(Resource):

    # find specific documents depending on connected querys
    def get(self, queryId):

        data = []

        from app import mongo, conf

        cursor = getattr(getattr(mongo, conf.CURSOR_DB), coll).find({"query": { "$in": [ObjectId(queryId)]}} )

        for document in cursor:
            data.append(document)

        return json.loads(json_util.dumps({"DOCUMENTS": data}))


class DocumentbyID(Resource):
    # find specific document depending on ID

    def get(self, documentId):
        data = []

        from app import mongo, conf

        data = getattr(getattr(mongo, conf.CURSOR_DB), coll).find_one({'_id': ObjectId(documentId)})

        data_sanitized = json.loads(json_util.dumps(data))

        return ({"DOCUMENT": data_sanitized})


class DocumentbyIDUserComment(Resource):


    def put(self, documentId):
        from app import mongo, conf
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str, required=True, help = 'No userId given', location='json' ) # try without location
        parser.add_argument('commentText', type=str, required = True, help = 'No commentText given', location = 'json') # try without location & action
        request_params = parser.parse_args()

        result = getattr(getattr(mongo, conf.CURSOR_DB), coll).update({'_id': ObjectId(documentId) }, { '$push': {"comments": {"c_user": ObjectId(request_params['userId']), "text": request_params['commentText']}}})

        response = {
             'result': result,
             'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized


class DocumentbyIDUserTag(Resource):

    def put(self, documentId):
        from app import mongo, conf
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str, required=True, help='No userId given',
                            location='json')
        parser.add_argument('tags', type=list, required=True, help='No Tag given',
                            location='json')
        request_params = parser.parse_args()

        result1 = getattr(getattr(mongo, conf.CURSOR_DB), coll).update({'_id': ObjectId(documentId)},
                                            {'$pull': {'tags_user': {'t_user': ObjectId(request_params['userId'])}}})

        result = getattr(getattr(mongo, conf.CURSOR_DB), coll).update({'_id': ObjectId(documentId)}, {'$push': {
            "tags_user": {"t_user": ObjectId(request_params['userId']), "tags": request_params['tags']}}})

        response = {
            'result1': result1,
            'result': result,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized



class DocumentbyIDUserBookmark(Resource):
    def put(self, documentId):

        from app import mongo, conf
        parser = reqparse.RequestParser()
        parser.add_argument('userId', type=str, required=True, help='No userId given',
                            location='json')
        parser.add_argument('bookmarkStatus', type=str, required=True, help='No bookmarkStatus given',
                            location='json')
        request_params = parser.parse_args()

        result1 = getattr(getattr(mongo, conf.CURSOR_DB), coll).update({'_id': ObjectId(documentId)}, { '$pull': {'bookmarks': {'b_user': ObjectId(request_params['userId'])}}})
        result2 = getattr(getattr(mongo, conf.CURSOR_DB), coll).update({'_id': ObjectId(documentId)}, {
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
        from app import mongo, conf

        parser = reqparse.RequestParser()
        parser.add_argument('title', type=str, required=True, help='No title given',
                            location='json')
        parser.add_argument('abstract', type=str, required=False, help='No abstract given',
                            location='json')
        parser.add_argument('publishedAt', type=str, required=True, help='No publishedAt given',
                            location='json')
        parser.add_argument('url', type=str, required=True, help='No user given',
                            location='json')
        parser.add_argument('query', type=str, required=True, help='No query given',
                            location='json')
        parser.add_argument('tags_system', type=list, required=True, help='No tags given',
                            location='json')

        request_params = parser.parse_args()


        try:

            result = getattr(getattr(mongo, conf.CURSOR_DB), coll).insert({
                "abstract": request_params['abstract'],
                "bookmarks": [],
                "comments": [],
                "date": request_params['publishedAt'],
                "query": ObjectId(request_params['query']),
                "related_docs": [],
                "sources": {
                    "quellenab": [],
                    "quellenunab": False
                },
                "super_doc": "",
                "tags_system": request_params['tags_system'],
                "tags_user": [],
                "title": request_params['title'],
                "url": request_params['url']
            })

        except pymongo.errors.DuplicateKeyError as e:
            result = {}
            result['success'] = False
            result['error'] = ("This document's title already exists. Document was not inserted into db.")


        # create an index everytime a new doc was inserted, to prevent duplicate entries regarding title!!
        # we could prevent duplicate entries also through unify the url or other metadata..

        result1 = getattr(getattr(mongo, conf.CURSOR_DB), coll).create_index([('title', pymongo.ASCENDING)], unique=True)

        response = {
            'result': result,
            'result1': result1,
            'error_code': 0
        }

        data_sanitized = json.loads(json_util.dumps(response))
        return data_sanitized
