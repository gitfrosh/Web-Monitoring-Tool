"""Lorem ipsum
"""
import executor as executor
import requests
from flask import Flask, render_template, request, url_for
from flask_pymongo import PyMongo
from flask_restful import reqparse, abort, Api, Resource
from celery import Celery
import newsApi
from api.document import *
from api.user import *
from api.query import *
from time import sleep, time
from time import sleep
from concurrent.futures import ThreadPoolExecutor
from threading import Thread
import schedule


app = Flask(__name__)

# initiate Thread and Executor
executor = ThreadPoolExecutor(max_workers=10)

# configure MongoDB and driver PyMongo
app.config["MONGO_DBNAME"] = "wmt-test"
mongo = PyMongo(app, config_prefix='MONGO')

# web app routing: only a few routes here, Angular does the rest
@app.route('/')
def showIndex():

    return render_template('dashboard_index.html')

@app.route('/login/')
def showLoginpage():
    return render_template('login.html')

@app.route('/admin/')
def showAdmin():
    return render_template('admin.html')

def sayHello():
  print ('Hello!')
  return 'hello.'


# special file handlers and error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


##----------------------------------------------------------------------------------------------------------------------



##----------------------------------------------------------------------------------------------------------------------
# --> apiIntegration

# periodic task
def run_every_1000_seconds():
    print("Start periodic task!")
    executor.submit(newsApi.requestNewsAPI())

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
    # restApi.add_resource(UserbyIDNewQuery, "/api/user/<string:userId>/deleteQuery") #todo
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


    schedule.every(1000).seconds.do(run_every_1000_seconds)
    t = Thread(target=run_schedule)
    t.start()
    app.run(host='0.0.0.0',use_reloader=False, debug=True, threaded=True)


















