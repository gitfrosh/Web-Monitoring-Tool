from flask import Flask, render_template
from flask.ext.pymongo import PyMongo
from flask_restful import reqparse, abort, Api, Resource
from api.document import *
from api.user import *

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
restApi.add_resource(User, "/api/users/<string:userId>")

# POST
# new user, maybe later

# DELETE
# we don't need for now

# PUT
# update user's data // we need this to create new topics


#################### query specific

# POST
# new query (when topic is created in user's data)

# GET
# we don't need for now

# DELETE
# we don't need for now

# PUT
# update querys (needed for status)

#################### document specific

# POST
# web monitoring backend API

# GET
restApi.add_resource(AllDocuments, "/api/documents/")
restApi.add_resource(DocumentsByQuery, "/api/documents/<string:queryId>") # rename in api/documents/querys/
restApi.add_resource(DocumentbyID, "/api/document/<string:documentId>")

# PUT
restApi.add_resource(DocumentbyIDUserComment, "/api/document/<string:documentId>/newComment")
restApi.add_resource(DocumentbyIDUserBookmark, "/api/document/<string:documentId>/newBookmark")
restApi.add_resource(DocumentbyIDUserTag, "/api/document/<string:documentId>/newTag")
restApi.add_resource(DocumentbyIDSource, "/api/document/<string:documentId>/newSource")

# DELETE (we don't need, documents won't be deleted)

#################### sources specific

# this is very low priority!


# STARTS THE SERVER!

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)


















