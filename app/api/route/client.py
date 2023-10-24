"""
    Defines the blueprint for the clients
"""
from flask import Blueprint
from flask_restful import Api

from app.api.resource import ClientResource, ClientListResource

CLIENT_BLUEPRINT = Blueprint("client", __name__)
Api(CLIENT_BLUEPRINT).add_resource(
    ClientResource, "/client/<int:id>",
)
Api(CLIENT_BLUEPRINT).add_resource(
    ClientListResource, "/clients",
)