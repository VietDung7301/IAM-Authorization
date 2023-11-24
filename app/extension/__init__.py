from flask_sqlalchemy import SQLAlchemy
import redis
import config

db = SQLAlchemy()

r = redis.Redis(host=config.REDIS_HOST, port=config.REDIS_PORT, decode_responses=True)
