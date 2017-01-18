from flask import Flask, render_template
from flask.ext.pymongo import PyMongo
from flask_restful import reqparse, abort, Api, Resource
from api.document import *
from api.user import *
from api.query import *

app = Flask(__name__)



app.config["MONGO_DBNAME"] = "wmt-test"
mongo = PyMongo(app, config_prefix='MONGO')



# only a few routes here, Angular does the rest

@app.route('/')
def showIndex():
    return render_template('dashboard_index.html')

@app.route('/login/')
def showLoginpage():
    return render_template('login.html')

# special file handlers and error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


#@app.route('/favicon.ico')
#def favicon():
#    return

# Setup the Api here
restApi = Api(app)

##################### user specific

# GET
restApi.add_resource(AllUsers, "/api/users/")
restApi.add_resource(User, "/api/users/<string:userId>") # rename in "user"

# POST
# new user, maybe later
# restApi.add_resource(NewUser, "/api/users/") # todo

# DELETE
# we don't need for now

# PUT
# update user's data
# create/delete new topics and querys
restApi.add_resource(UserbyIDNewQuery, "/api/user/<string:userId>/newQuery")
#restApi.add_resource(UserbyIDNewQuery, "/api/user/<string:userId>/deleteQuery") #todo
# create or edit topic
restApi.add_resource(UserbyIdTopic, "/api/user/<string:userId>/topic")


#################### query specific

# POST
# new query (when topic is created in user's data)
restApi.add_resource(NewQuery, "/api/querys")

# GET
restApi.add_resource(AllQuerys, "/api/querys/")
restApi.add_resource(Query, "/api/query/<string:queryId>")


# DELETE
# we don't need for now

# PUT
# update querys
restApi.add_resource(QuerybyIDStatus, "/api/query/<string:queryId>/newStatus")


#################### document specific

# POST
# web monitoring backend API
#restApi.add_resource(NewDocument, "/api/documents/") #todo

# GET
restApi.add_resource(AllDocuments, "/api/documents/")
restApi.add_resource(DocumentsByQuery, "/api/documents/<string:queryId>") # rename in api/documents/querys/
restApi.add_resource(DocumentbyID, "/api/document/<string:documentId>")

# PUT # will also be used to delete data parts like bookmarks, comments, ... # todo
restApi.add_resource(DocumentbyIDUserComment, "/api/document/<string:documentId>/newComment")
restApi.add_resource(DocumentbyIDUserBookmark, "/api/document/<string:documentId>/newBookmark")
restApi.add_resource(DocumentbyIDUserTag, "/api/document/<string:documentId>/newUserTag") # not yet used
restApi.add_resource(DocumentbyIDSource, "/api/document/<string:documentId>/newSource") # not yet used

# DELETE (we don't need, documents won't be deleted)

#################### sources specific

# this is very low priority!


# STARTS THE SERVER!

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)


















