"""
    Define the Client model.
"""
from app.extension import db
from app.model.base import BaseModel, MetaBaseModel


class ClientModel(db.Model, BaseModel, metaclass=MetaBaseModel):
    """The Client model."""

    __tablename__ = "client"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.Integer)
    credential = db.Column(db.String(200))

    def __init__(self, type, credential):
        self.type = type,
        self.credential = credential
