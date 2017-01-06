from flask import Flask, render_template, jsonify
from pymongo import MongoClient
from flask_mongoalchemy import MongoAlchemy


app = Flask(__name__)

# MongoAlchemy konfiguriern
app.config['MONGOALCHEMY_DATABASE'] = 'library'
db = MongoAlchemy(app)

# only a few routes here, Angular does the rest

@app.route('/')
def showIndex():
    return render_template('dashboard_index.html')

@app.route('/login/')
def showLoginpage():
    return render_template('login.html')

# special file handlers and error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


#@app.route('/favicon.ico')
#def favicon():
#    return


tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})




	
if __name__ == "__main__":
    app.run(host='0.0.0.0')


