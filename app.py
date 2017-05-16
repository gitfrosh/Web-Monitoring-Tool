"""This is where all the magic starts. We initiate the db connection, the flask microframework for web applications
in python, we load configurations, set up basic routing to realize login, dashboard, errorhandling (404) and set up the scheduling of tasks
that are executed by the flask server application.

The backend is all python! The frontend is completely standalone AngularJS. AngularJS components are served only in
the static folders js (app.js, controllers, directives,..) and partials for the view. Backend and Frontend communicate
via REST. Like that, any component can be substituted.

Communicating via RESTful APIs is essential: we set up our own REST API ("myRestAPI") which handles all incoming CRUD
requests from the frontend and moves them on to the MongoDB.

Additionally we need to talk to external APIs where we fetch the actual documents. This is realized through "newsApi.py"
and the PreProcessor. The prototype uses webhose.io for examplified monitoring. """

from threading import Thread
from time import sleep


import schedule
from flask import Flask, render_template, redirect


from flask_pymongo import PyMongo

import newsApi
from api.document import *
from api.query import *
from api.user import *
from api.source import *

import config as conf



def config_loader():

    # Load configuration
    try:  # configuration
        app.config.from_pyfile('config.py')  # Load first in case we want to use in other config opt
        app.logger.info('config file loaded successfully')
    except IOError:
        app.config['SECRET_KEY'] = 'secret_key'  # Default setting in case file does not exist yet
        app.logger.warning('Secret config file not found, secret_key not found. Setting secret_key as default secret_key')


def run_task():
    # periodic tasks
            app.logger.info('Periodic task started')
            print("Start periodic task!")
            newsApi.collectDocuments()



def run_schedule():
    # schedule operation
            app.logger.info('Schedule started')
            while 1:
                schedule.run_pending()
                sleep(1)

#----------------------------------------------------------------------------------------------------------------------
# Some configuration first

app = Flask(__name__)
config_loader()

# ENABLE (uncomment) THE SCHEDULOR IF YOU WANT TO TRY OUT WEBHOSE.IO MONITORING! (runs every twelve hours then)
#schedule.every(43200).seconds.do(run_task)
t = Thread(target=run_schedule)
t.start()


# configure MongoDB and driver PyMongo (DEBUG / DEVELOPMENT ENVIRONMENT (with Werkzeug server) !!!!!) starts on http://127.0.0.1:5000/
mongo = PyMongo(app, config_prefix='MONGO')

# configure MongoDB and driver PyMongo (uncomment for PRODUCTION ENVIRONMENT HEROKU (with Gunicorn) !!!!!)
#mongo = MongoClient(conf.mongo_db_uri)






#----------------------------------------------------------------------------------------------------------------------
# web app routing: only a few routes here, Angular does the rest

@app.route('/')
def redirectToDashboard():
    return redirect("/dashboard/")

@app.route('/dashboard/')
def showIndex():
    return render_template('dashboard.html')

# special file handlers and error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404



##----------------------------------------------------------------------------------------------------------------------
# apiIntegration


myRestApi = Api(app)


#user specific

myRestApi.add_resource(AllUsers, "/api/users/")
myRestApi.add_resource(User, "/api/users/<string:userId>")  # rename in "user"

myRestApi.add_resource(NewUser, "/api/register/")
myRestApi.add_resource(VerifyUser, "/api/users/")
myRestApi.add_resource(LogoutUser, "/api/logout/")
myRestApi.add_resource(UserStatus, "/api/status/")

myRestApi.add_resource(UserbyIDNewQuery, "/api/user/<string:userId>/newQuery")
# restApi.add_resource(UserbyIDDeleteQuery, "/api/user/<string:userId>/deleteQuery") #todo

myRestApi.add_resource(UserbyIdTopic, "/api/user/<string:userId>/topic")

# query specific

myRestApi.add_resource(NewQuery, "/api/querys")

myRestApi.add_resource(AllQuerys, "/api/querys/")
myRestApi.add_resource(Query, "/api/query/<string:queryId>")

myRestApi.add_resource(QuerybyIDStatus, "/api/query/<string:queryId>/newStatus")

# document specific

    # web monitoring backend API
myRestApi.add_resource(NewDocument, "/api/documents/")

myRestApi.add_resource(AllDocuments, "/api/documents/")
myRestApi.add_resource(DocumentsByQuery, "/api/documents/<string:queryId>")  # rename in api/documents/querys/
myRestApi.add_resource(DocumentbyID, "/api/document/<string:documentId>")

    # PUT # will also be used to delete data parts like bookmarks, comments, ... # todo
myRestApi.add_resource(DocumentbyIDUserComment, "/api/document/<string:documentId>/newComment")
myRestApi.add_resource(DocumentbyIDUserBookmark, "/api/document/<string:documentId>/newBookmark")
myRestApi.add_resource(DocumentbyIDUserTag, "/api/document/<string:documentId>/newUserTag")
myRestApi.add_resource(DocumentbyIDSource, "/api/document/<string:documentId>/newSource")  # not yet used

    # DELETE (we don't need, documents won't be deleted)

# sources specific
# this is very low priority! .. not yet implemented..


#----------------------------------------------------------------------------------------------------------------------
# STARTS THE SERVER!

if __name__ == "__main__":



    app.run()



















