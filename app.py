"""This is where all the magic starts. We initiate the db connection, the flask microframework for web applications
in python, we set up basic routing to realize login, dashboard, errorhandling (404) and set up the scheduling and
threading of tasks that are executed by the flask server application.

The backend is all python! The frontend is completely standalone AngularJS. AngularJS components are served only in
the static folders js (app.js, controllers, directives,..) and partials for the view. Backend and Frontend communicate
via REST. Like that, any component can be substituted.

Communicating via RESTful APIs is essential: we set up an own REST API ("myRestAPI") which handles all incoming CRUD
requests from the frontend and moves them on to the MongoDB.

Additionally we need to talk to external APIs where we fetch the actual documents. This is realized through "newsApi.py"
and the PreProcessor."""

from concurrent.futures import ThreadPoolExecutor
from threading import Thread
from time import sleep

import executor as executor
import schedule
from flask import Flask, render_template
from flask_pymongo import PyMongo

import newsApi
from api.document import *
from api.query import *
from api.user import *
from api.source import *

app = Flask(__name__)

# app.py

# initiate Thread and Executor
executor = ThreadPoolExecutor(max_workers=10)

# configure MongoDB and driver PyMongo
app.config["MONGO_DBNAME"] = "wmt-test"
mongo = PyMongo(app, config_prefix='MONGO')

# web app routing: only a few routes here, Angular does the rest
@app.route('/dashboard/')
def showIndex():
    return render_template('dashboard.html')

@app.route('/login/')
def showLoginpage():
    return render_template('login.html')


# special file handlers and error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


##----------------------------------------------------------------------------------------------------------------------



##----------------------------------------------------------------------------------------------------------------------
# --> apiIntegration

# periodic task
def run_every_10_seconds():
    print("Start periodic task!")
    executor.submit(newsApi.collectDocuments)
   # executor.submit(newsApi.fetchQuerys())
    #executor.submit(newsApi.requestNewsAPI())

# schedule operation
def run_schedule():
    while 1:
        schedule.run_pending()
        sleep(1)


myRestApi = Api(app)


    ##################### user specific

    # GET


myRestApi.add_resource(AllUsers, "/api/users/")
myRestApi.add_resource(User, "/api/users/<string:userId>")  # rename in "user"

    # POST
    # new user, maybe later
    # restApi.add_resource(NewUser, "/api/users/") # todo

    # DELETE
    # we don't need for now

    # PUT
    # update user's data
    # create/delete new topics and querys
myRestApi.add_resource(UserbyIDNewQuery, "/api/user/<string:userId>/newQuery")
    # restApi.add_resource(UserbyIDDeleteQuery, "/api/user/<string:userId>/deleteQuery") #todo
    # create or edit topic
myRestApi.add_resource(UserbyIdTopic, "/api/user/<string:userId>/topic")

    #################### query specific

    # POST
    # new query (when topic is created in user's data)
myRestApi.add_resource(NewQuery, "/api/querys")

    # GET
myRestApi.add_resource(AllQuerys, "/api/querys/")
myRestApi.add_resource(Query, "/api/query/<string:queryId>")

    # DELETE
    # we don't need for now

    # PUT
    # update querys
myRestApi.add_resource(QuerybyIDStatus, "/api/query/<string:queryId>/newStatus")

    #################### document specific

    # POST
    # web monitoring backend API
myRestApi.add_resource(NewDocument, "/api/documents/")

    # GET
myRestApi.add_resource(AllDocuments, "/api/documents/")
myRestApi.add_resource(DocumentsByQuery, "/api/documents/<string:queryId>")  # rename in api/documents/querys/
myRestApi.add_resource(DocumentbyID, "/api/document/<string:documentId>")

    # PUT # will also be used to delete data parts like bookmarks, comments, ... # todo
myRestApi.add_resource(DocumentbyIDUserComment, "/api/document/<string:documentId>/newComment")
myRestApi.add_resource(DocumentbyIDUserBookmark, "/api/document/<string:documentId>/newBookmark")
myRestApi.add_resource(DocumentbyIDUserTag, "/api/document/<string:documentId>/newUserTag")  # not yet used #todo
myRestApi.add_resource(DocumentbyIDSource, "/api/document/<string:documentId>/newSource")  # not yet used

    # DELETE (we don't need, documents won't be deleted)

    #################### sources specific

    # this is very low priority!

#----------------------------------------------------------------------------------------------------------------------

# STARTS THE SERVER!

if __name__ == "__main__":


    #schedule.every(30).seconds.do(run_every_10_seconds)
    t = Thread(target=run_schedule)
    t.start()
    app.run(host='0.0.0.0',use_reloader=False, debug=True, threaded=True)


















