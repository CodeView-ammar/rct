from django.db import IntegrityError
import json
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(BASE_DIR, "training/database_names.json"), "r") as f:
    my_dict = json.load(f)
first_key = next(iter(my_dict))
Engine="django.db.backends.mysql"
NameDB=my_dict[first_key]
User="admin_oaks"
password="g4rT3MsSvjMaPuMMrMLLgWBtKwMABj"
key_encrypt =b'Z0qlpXfH7iqY1NN6kI7RCv3mxK26Yk7l2lsgfNihqkw='

Host="localhost" 
# PORT= str(['dataBasePort'])
if Engine=="django.db.backends.mysql": 
    PORT= "3306"
else:
    PORT= "5432"

DATABASES = {"default": {
            "ENGINE":Engine,  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
            "NAME": NameDB,  # Or path to database file if using sqlite3.
            "USER": User,  # Not used with sqlite3.
            "PASSWORD": password,  # Not used with sqlite3.
            "HOST": Host,  # Set to empty string for localhost. Not used with sqlite3.
            "PORT":PORT,
            
            'OPTIONS': {
            'sql_mode': 'traditional',
        }   
        }
}
try:


    for key in my_dict.keys():


        DATABASES[key]={
            
            "ENGINE":Engine,  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
            "NAME": key,  # Or path to database file if using sqlite3.
            "USER": User,  # Not used with sqlite3.
            "PASSWORD": password,  # Not used with sqlite3.
            "HOST": Host,  # Set to empty string for localhost. Not used with sqlite3.
            "PORT":PORT,
        }
    # خاص بدخول إلى السنوات السابقة
    DATABASES['auth_db']= {
    "ENGINE":Engine,  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
    "USER": User,  # Not used with sqlite3.
    "PASSWORD": password,  # Not used with sqlite3.
    "HOST": Host,  # Set to empty string for localhost. Not used with sqlite3.
    "PORT":PORT,
    }
    AUTH_DB = 'auth_db'
except IntegrityError:
    raise
