"""We set up the fetching of news documents here.
First, we fetch all active querys for which documents shall be found.
Secondly, we deliver them to the external API or APIs we want to ask for documents.
Thirdly, we collect the found documents and transfer them to the PreProcessor, who will do important stuff
Fourthly, we save the preprocessed data in the db

"""

import json
import requests
from flask import Flask, app
from time import sleep
from bson import json_util, ObjectId
from preProcessor import preProcessing


def collectDocuments():


    listOfactiveQuerys = []
    fetchQuerys(listOfactiveQuerys)
    print(listOfactiveQuerys)

    if (listOfactiveQuerys):

        for query in listOfactiveQuerys:
            print(query)
            fetchedDocs = requestWebhose(query[0])  # request documents via Webhose.io # query[0] is only the term
            print(fetchedDocs)
            preProcessedDocs = preProcessing(fetchedDocs, query[1]) #query[1] is only the ObjectId
            print(preProcessedDocs)
            saveDocs(preProcessedDocs)

    else:
        print("No (active) querys to process!")

def fetchQuerys(listOfactiveQuerys):
    from app import conf
    # fetch current querys entered by user
    url = conf.MYRESTAPI_URL + "/querys/"
    r = requests.get(url).json()

    listOfactiveQueryIds = []

    # check all querys for any active ones
    for item in r['QUERYS']:
        #print(item)
        objectId = (item.get('_id'))['$oid']

        for item2 in item['status']:
            if item2['active'] == "True":
               #listOfactiveQuerys.append(item.get('term', 0))
               listOfactiveQuerys.append([item.get('term', 0), objectId])
               #print(listOfactiveQueryIds)

    return listOfactiveQuerys


# this is another api which was tested but not implemented (newsapi.org
# def requestNewsAPI(fetchedDocs):
#     # set up API integration here for newsapi.org
#     apiKey = "1c1211b562664037812900795a85b68c"
#     url = 'https://newsapi.org/v1/articles?source=wired-de&sortBy=latest&apiKey='
#
#     r = requests.get(url + apiKey).json()
#     fetchedDocs = r['articles']
#     moreResultsCount =r['moreResultsAvailable']
#
#     print(moreResultsCount)
#     print(fetchedDocs)
#     return fetchedDocs



def requestWebhose(query):
    from app import conf
    # set up Api integration for webhose.io
    apiKey = conf.WEBHOSE_APIKEY
    print(apiKey)


    url = "http://webhose.io/search?token="+apiKey+"&format=json&q=%22"+query+"%22%20language%3A(german)%20(site_type%3Anews)"#



    r = requests.get(url).json()

    fetchedDocs = r['posts']

    print (fetchedDocs)
    return fetchedDocs


def saveDocs(preProcessedDocs):
    from app import conf

    print("Try to save preProcessed documents to db...")

    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

    try:
        for article in preProcessedDocs:
            requests.post(conf.MYRESTAPI_URL +'/documents/', data=json.dumps(article), headers=headers)

    except requests.exceptions.ConnectionError:

        requests.status_code = "Connection refused"

    sleep(2)
    print("Documents were saved to db!")

    return