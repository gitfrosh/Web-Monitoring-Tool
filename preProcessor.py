"""The PreProcessor cleans, transforms and extracts data from the raw data (fetchedDocs) bevor it saves the
preprocessed documents into MongoDb.
"""
import json
from time import sleep

import requests


def preProcessing(fetchedDocs):
    print("Preprocessing documents...")

    for doc in fetchedDocs:
        print(doc)
        changeKeys(doc)
        print(doc)
        deleteUnusedMetadata(doc)
        print(doc)

    return

def deleteUnusedMetadata(doc):
    print ("Delete unused Metadata...")

    keys = ['external_links','thread','highlightTitle','uuid','language','ord_in_thread','entities','highlightText','rating',
                  'domain_rank','published','site','author']

    for key in keys:
        if key in doc:
            del doc[key]

    return doc


def chopAbstract():
    print("Chop abstract...")

    # absctracts shouldn't bear more than 500 characters
    return


def extractTags():
    # tags should be extracted here
    return


def changeKeys(doc):
    print("Change keys...")

    doc['publishedAt'] = doc.pop('crawled')
    doc['abstract'] = doc.pop('text')

    return doc


def saveDocs(preProcessedDocs):

    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

    try:
        for article in preProcessedDocs:
            requests.post('http://0.0.0.0:5000/api/documents/', data=json.dumps(article), headers=headers)

    except requests.exceptions.ConnectionError:

        requests.status_code = "Connection refused"

    sleep(10)
    print("Task is done!")

    return