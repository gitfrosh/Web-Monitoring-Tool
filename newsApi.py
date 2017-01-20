import json
from celery import Celery
import requests
from flask import Flask

def requestNewsAPI():
    # set up API integration here
    newsAPIkey = "1c1211b562664037812900795a85b68c"
    url = 'https://newsapi.org/v1/articles?source=wired-de&sortBy=latest&apiKey='

    r = requests.get(url + newsAPIkey).json()
    currentArticelsWW = (r['articles'])

    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

    try:
        for article in currentArticelsWW:
            requests.post('http://0.0.0.0:5000/api/documents/', data=json.dumps(article), headers=headers)
            # print(post.status_code)
            # time.sleep(.1)
    except requests.exceptions.ConnectionError:

        requests.status_code = "Connection refused"

    return