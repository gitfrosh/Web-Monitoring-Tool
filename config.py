APP_NAME = 'Web Monitoring Tool'
use_reloader = False
DEBUG = True
threaded = True
TIMEZONE = 'Europe/Oslo'
APP_LOG_FILE = 'logs/flask_app.log' # not working
SECRET_KEY = 'secret_key' # whatever you want
use_debugger=True
WEBHOSE_APIKEY = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' # your webhose API Key

# only in DEVELOPMENT ENVIRONMENT
MONGO_DBNAME = 'wmt-test' # whatever you want
MYRESTAPI_URL = 'http://0.0.0.0:5000/api' # your local api base url
CURSOR_DB = "db"

# enable for PRODUCTION ENVIRONMENT HEROKU
#MYRESTAPI_URL = 'http://wm-tool.herokuapp.com/api' # example
#mongo_db_uri = "mongodb://heroku_xxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxx@xxxxxxxx.mlab.com:45009/heroku_xxxxxxxx" # your whatever mongodb_heroku_uri

# enable for PRODUCTION ENVIRONMENT HEROKU
#CURSOR_DB = "heroku_xxxxxxxx"
