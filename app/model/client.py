"""
    Define the Client model.
"""
from app.extension import db
from app.model.base import BaseModel, MetaBaseModel


class ClientModel(db.Model, BaseModel, metaclass=MetaBaseModel):
    """The Client model."""

    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    client_secret = db.Column(db.String(200))
    redirect_url = db.Column(db.String(1000))
    client_type = db.Column(db.Integer)

    def __init__(self, client_secret, redirect_url, client_type):
        self.client_secret = client_secret,
        self.redirect_url = redirect_url,
        self.client_type = client_type
