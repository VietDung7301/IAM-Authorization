import logging
import os

DEBUG = os.getenv("ENVIRONMENT") == "DEV"
APPLICATION_ROOT = os.getenv("APPLICATION_ROOT", "/api")
HOST = os.getenv("APPLICATION_HOST")
PORT = int(os.getenv("APPLICATION_PORT", "3000"))
SQLALCHEMY_TRACK_MODIFICATIONS = False
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT"))
AUTH_CODE_EXP=int(os.getenv("AUTH_CODE_EXP"))
TOKEN_EXP=int(os.getenv("TOKEN_EXP"))

DB_CONTAINER = os.getenv("APPLICATION_DB_CONTAINER", "db")
MYSQL = {
    "user": os.getenv("DB_USER", "root"),
    "pw": os.getenv("DB_PASSWORD", ""),
    "host": os.getenv("DB_HOST", DB_CONTAINER),
    "port": os.getenv("DB_PORT", 3306),
    "db": os.getenv("DB_NAME", "db"),
}
DB_URI = "mysql://%(user)s:%(pw)s@%(host)s:%(port)s/%(db)s" % MYSQL

logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", "server.log"),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)