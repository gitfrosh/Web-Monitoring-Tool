# app.py

from flask import Flask, render_template
from flask_pymongo import PyMongo
# more imports..

app = Flask(__name__)

app.config["MONGO_DBNAME"] = "wmt-test"
mongo = PyMongo(app, config_prefix='MONGO')




#api/document.py

def get(self):

    from app import mongo

    cursor = mongo.db.documents.find({})