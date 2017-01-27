# app.py

from flask import Flask
from flask_restful import Api

app = Flask(__name__)

# more Flask configuration here ..

myRestApi = Api(app)
    # POST
    # web monitoring backend API
myRestApi.add_resource(NewDocument, "/api/documents/")

    # GET
myRestApi.add_resource(AllDocuments, "/api/documents/")
myRestApi.add_resource(DocumentsByQuery, "/api/documents/<string:queryId>")  # rename in api/documents/querys/
myRestApi.add_resource(DocumentbyID, "/api/document/<string:documentId>")