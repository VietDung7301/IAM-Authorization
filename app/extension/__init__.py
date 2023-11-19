from flask_sqlalchemy import SQLAlchemy
import redis

db = SQLAlchemy()

r = redis.Redis(host='localhost', port=6379, decode_responses=True)
