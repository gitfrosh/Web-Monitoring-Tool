"""The PreProcessor cleans, transforms and extracts data from the raw data (fetchedDocs) bevor it saves the
preprocessed documents into MongoDb.
"""
import json
from time import sleep
import rakeNLP
import requests
from bson import json_util, ObjectId


def preProcessing(fetchedDocs, query):
    print("Preprocessing documents...")

    for doc in fetchedDocs:
        #print(doc)
        changeKeys(doc)
        #print(doc)
        deleteUnusedMetadata(doc)
        #print(doc)
        addQuery(doc, query)
        #print(doc)
        extractTags(doc)
        #print(doc)
        #chopAbstract(doc)
        #print(doc)

    return fetchedDocs

def deleteUnusedMetadata(doc):
    print ("Delete unused Metadata...")

    keys = ['external_links','thread','highlightTitle','uuid','language','ord_in_thread','entities','highlightText','rating',
                  'domain_rank','published','site','author']

    for key in keys:
        if key in doc:
            del doc[key]

    return doc


def chopAbstract(doc):
    print("Chop abstract...")

    # something like this: s[0:100]

    # absctracts shouldn't bear more than 500 characters
    return doc

def addQuery(doc, query):
    print("Add query...")
    doc['query'] = query
    return doc


def extractTags(doc):
    """We use the RAKE Library here, to extract tags! The rake object need the Stopword-List (english & german here)
    and three parameters: keywords must have min. X characters, each keyword phrase must have at most X words, each keyword
    appears at least X times in the text
    """
    print("Extract Tags...")
    keywords = []

    text = (doc['abstract'])
    rake_object = rakeNLP.Rake("stopwords_de_en.txt", 4, 3, 4)
    raw_keywords = rake_object.run(text)
    #print("Keywords:", raw_keywords)

    # delete the keyword score because we don't need it in the db
    for keyword in raw_keywords:
        keywords = [(keyword[0]) for keyword in raw_keywords]

    print(keywords)
    doc['tags_system'] = keywords

    return doc


def changeKeys(doc):
    print("Change keys...")

    doc['publishedAt'] = doc.pop('crawled')
    doc['abstract'] = doc.pop('text')

    return doc


