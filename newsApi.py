"""We set up the fetching of news documents here.
First, we fetch all active querys for which documents shall be found.
Secondly, we deliver them to the external APIs we want to ask for documents.
Thirdly, we collect the found documents and transfer them to the PreProcessor, who will move them on the MongoDB.
"""

import json
from celery import Celery
import requests
from flask import Flask
from time import sleep

from preProcessor import preProcessing




def collectDocuments():
    fetchedDocs = []
    listOfactiveQuerys = []
    fetchQuerys(listOfactiveQuerys)
    print(listOfactiveQuerys)                       # log active querys

    for query in listOfactiveQuerys:
    #    requestWebhose(query, fetchedDocs)  # request documents via Webhose.io
        #requestNewsAPI(fetchedDocs)  # request documents via NewsAPI.org (no query parameter possible)
        fetchedDocs = [{"thread": {"replies_count": 0, "url": "http://omgili.com/ri/jHIAmI4hxg_f.8dqKpO0NTr13NaBRrvpjGoIfeR0P0vWhKn74qPtzFkNV_3sEwKId1PRAk2QZyw9zNBib9tP47M3Ko06EB1CNV1u5WGz3P8EvsQ2wHgp107AQpOGxyAB5canPSckDumDubPsTJpHs2l6bvz7rMKY3cjw5zGxk8glZIFrrhbdcQ--", "site_section": "http://www.stern.de/feed/overview/#utm_campaign=tag-im-ueberblick&utm_medium=rssfeed&utm_source=standard", "published": "2017-01-18T19:02:48.760+02:00", "section_title": "Der Tag im Überblick im RSS-Feed von STERN.DE", "uuid": "e56ff378b5dd90759a2d78452dc6fcf871b4c9fe", "country": "DE", "site_type": "news", "title": "Anschlag auf Weihnachtsmarkt: Observiert, beurteilt, durchgerutscht - was im Fall Anis Amri wirklich schiefgelaufen ist", "spam_score": 0.0, "social": {"facebook": {"likes": 105, "comments": 0, "shares": 105}, "gplus": {"shares": 0}, "vk": {"shares": 0}, "pinterest": {"shares": 0}, "linkedin": {"shares": 0}, "stumbledupon": {"shares": 0}}, "site": "stern.de", "performance_score": 1, "title_full": "Anschlag auf Weihnachtsmarkt: Observiert, beurteilt, durchgerutscht - was im Fall Anis Amri wirklich schiefgelaufen ist", "main_image": "http://image.stern.de/7287912/16x9-1200-675/a465c1e1ef757a2bc01bdde6fd3a7292/JU/anis-amri-fahndungsfotos.jpg", "site_categories": ["news", "education"], "domain_rank": 2758, "site_full": "www.stern.de", "participants_count": 1}, "url": "http://omgili.com/ri/jHIAmI4hxg_f.8dqKpO0NTr13NaBRrvpjGoIfeR0P0vWhKn74qPtzFkNV_3sEwKId1PRAk2QZyw9zNBib9tP47M3Ko06EB1CNV1u5WGz3P8EvsQ2wHgp107AQpOGxyAB5canPSckDumDubPsTJpHs2l6bvz7rMKY3cjw5zGxk8glZIFrrhbdcQ--", "title": "Anschlag auf Weihnachtsmarkt: Observiert, beurteilt, durchgerutscht - was im Fall Anis Amri wirklich schiefgelaufen ist", "ord_in_thread": 0, "crawled": "2017-01-18T19:02:48.760+02:00", "uuid": "e56ff378b5dd90759a2d78452dc6fcf871b4c9fe", "language": "german", "external_links": [], "author": "Thomas Krause", "entities": {"locations": [], "organizations": [], "persons": []}, "highlightTitle": "", "rating": "", "published": "2017-01-18T19:02:48.760+02:00", "text": "Anis Amri: Chronologie zeigt, warum Sicherheitsbehörden ihn nicht stoppten 18. Januar 2017 17:57 Uhr Anschlag auf Weihnachtsmarkt Observiert, beurteilt, durchgerutscht - was im Fall Anis Amri wirklich schiefgelaufen ist Das Bundesjustizministerium hat eine Chronologie zum Fall Anis Amri veröffentlicht. Sie zeigt, was deutsche Sicherheitsbehörden vor dem Anschlag auf den Berliner Weihnachtsmarkt über ihn wussten. Doch die drängendsten Fragen beantwortet sie nicht. Fullscreen Anis Amri, wie ihn wohl inzwischen jeder Bundesbürger kennt © Bundeskriminalamt/DPA Anis Amri war Thema bei nicht weniger als 23 Sicherheitsbehörden und -institutionen, bevor er einen LKW auf den Weihnachtsmarkt am Berliner Breitscheidplatz lenkte. Das geht aus der Chronologie Behördenhandeln um die Person des Attentäters vom Breitscheidplatz Anis Amri hervor, die das Bundesjustizministerium online veröffentlicht hat. Demnach ist Amri im Oktober 2015 das erste Mal einem Zimmernachbarn in einer Flüchtlingsunterkunft in Emmerich Nordrhein-Westfalen) aufgefallen, weil er Fotos schwarz gekleideter Personen mit Kalaschnikows und Handgranaten auf seinem Handy hatte. Weil er aber unter einem seiner falschen Namen dort lebte, konnte diese Beobachtung erst Monate später Amri zugeordnet werden. Als Amris Identität im Januar 2016 geklärt war, hatten sich schon neun Sicherheitsbehörden mit ihm befasst, darunter der Bundesverfassungsschutz, das Bundeskriminalamt und der Generalbundesanwalt. Bitte um Observierung von Anis Amri Als das LKA Nordrhein-Westfalen Amri am 17. Februar 2016 als Gefährder einstufte, hatten ihn insgesamt schon 13 Behörden auf dem Radar. Einen Tag später reiste Amri nach Berlin . Das LKA in Nordrhein-Westfalen bat die Berliner Kollegen darum, Amri zu observieren. Doch die Bitte kam zu kurzfristig, es gab nur zu eine Personenkontrolle als Amri am Berliner ZOB aus dem Fernbus stieg. Die Beamten beschlagnahmten Amris Handy, fanden später darauf aber keine Hinweise, dass er einen Anschlag plante. Amri pendelte anfangs zwischen Nordrhein-Westfalen und Berlin. Am 10. März 2016 zog Amri dann ganz nach Berlin. Nordrhein-Westfalen übergab die Zuständigkeit für Amri an Berlin. Obwohl auch das dortige LKA ihn als Gefährder einstufte, beendete es acht Tage später die Observation. Inzwischen war auch die Generalstaatsanwaltschaft Berlin auf Amri aufmerksam geworden, kam aber zu dem Schluss, dass es keinen ausreichenden Anfangsverdacht gab, Amri bereite einen Anschlag vor. Neun Monate, achtzehn Behörden Als Ende März die Ausländerbehörde Oberhausen festlegte, dass Amri auch dort wohnen muss, beeindruckte ihn das wenig. Vielleicht, weil das Dokument, in dem das vermerkt ist, auf einen seiner falschen Namen ausgestellt war. Keine zwei Wochen später zog es ihn wieder nach Berlin. Konsequenzen hatte das keine, obwohl inzwischen Amris Handy überwacht wurde und sein Aufenthaltsort damit ständig nachvollziehbar war. Mitte April leitete die Staatsanwaltschaft Duisburg ein Verfahren gegen Amri wegen gewerbsmäßigen Betruges ein. Es war die 18. Sicherheitsbehörde , die sich mit Amri befasste - nicht einmal neun Monate nach seiner Ankunft in Deutschland. Fehleinschätzungen oder Unvorhersehbarkeit? Immer wieder beurteilten sie Amri als jemanden, von dem keine konkrete Bedrohung ausgeht. Er fiel eher als Kleindealer und Drogenkonsument auf. Was den Islam angeht, schwankte Amri zwischen islamistischen Standpunkten und dem Aufgeben des Fastens während des Ramadans. Es entstand der Eindruck eines jungen Mannes, der unstet, sprunghaft und äußerst wenig gefestigt erscheint, lautete das Fazit nach fünf Monaten Telefon-Überwachung im September 2016. Trotzdem wurden einen Monat später alle Schengen-Staaten über Amri als Foreign Fighter (dt.: ausländischer Kämpfer, d. Red.) informiert. Die Chronologie zeigt, dass deutsche Sicherheitsbehörden Amri schon früh auf dem Schirm hatten. Sie haben ihre Informationen auch untereinander ausgetauscht. Trotzdem ist Amri durch ihr Netz geschlüpft. Haben sie ihn falsch eingeschätzt? Oder hat sein wechselhaftes Wesen es nahezu unmöglich gemacht, den Anschlag auf den Weihnachtsmarkt am Berliner Breitscheidplatz vorherzusehen? Diese Fragen beantwortet das Dokument nicht. Aber es sind Fragen, auf die die Sicherheitsbehörden schnellstmöglich Antworten finden sollten.", "highlightText": ""}]
        print(fetchedDocs)
        preProcessing(fetchedDocs, query)
    return None

def fetchQuerys(listOfactiveQuerys):
    # fetch current querys entered by user
    url = "http://0.0.0.0:5000/api/querys/"
    r = requests.get(url).json()

    # check all querys for any active ones
    for item in r['QUERYS']:
        for item2 in item['status']:
            if item2['active'] == "True":
                listOfactiveQuerys.append(item.get('term', 0))

    return listOfactiveQuerys


def requestNewsAPI(fetchedDocs):
    # set up API integration here for newsapi.org
    apiKey = "1c1211b562664037812900795a85b68c"
    url = 'https://newsapi.org/v1/articles?source=wired-de&sortBy=latest&apiKey='

    r = requests.get(url + apiKey).json()
    fetchedDocs = r['articles']
    moreResultsCount =r['moreResultsAvailable']

    print(moreResultsCount)
    print(fetchedDocs)
    return fetchedDocs



def requestWebhose(query, fetchedDocs):
    # set up Api integration for webhose.io
    apiKey = "99105d4f-bdaa-4ae6-8944-be95bf482266"
    url = "http://webhose.io/search?token="+apiKey+"&format=json&q=%22"+query+"%22%20language%3A(german)%20(site_type%3Anews)"#

    r = requests.get(url).json()

    fetchedDocs = r['posts']

    print (fetchedDocs)
    return fetchedDocs
