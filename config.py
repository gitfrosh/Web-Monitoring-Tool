APP_NAME = 'Web Monitoring Tool'
use_reloader = False
DEBUG = True
threaded = True
TIMEZONE = 'Europe/Oslo'
APP_LOG_FILE = 'logs/flask_app.log'
SECRET_KEY = 'secret_key'
use_debugger=True

# only in DEVELOPMENT ENVIRONMENT
MONGO_DBNAME = 'wmt-test'

WEBHOSE_APIKEY = '99105d4f-bdaa-4ae6-8944-be95bf482266'

# only in DEVELOPMENT ENVIRONMENT
MYRESTAPI_URL = 'http://0.0.0.0:5000/api'

# PRODUCTION ENVIRONMENT HEROKU
#MYRESTAPI_URL = 'http://wm-tool.herokuapp.com/api'
#mongo_db_uri = "mongodb://heroku_99b8pdxw:86gckmufoddor0so4hh24fs3fm@ds145009.mlab.com:45009/heroku_99b8pdxw"

# only in DEVELOPMENT ENVIRONMENT
CURSOR_DB = "db"

# PRODUCTION ENVIRONMENT HEROKU
#CURSOR_DB = "heroku_99b8pdxw"