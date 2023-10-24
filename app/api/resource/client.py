from flask_restful import Resource
from flask.json import jsonify


from app.repository import ClientRepo


class ClientResource(Resource):
    @staticmethod
    def get(id):
        """Return client information based on its id"""

        client = ClientRepo.get(id)
        if client is None:
            return None, 404
        return jsonify({"user": client.json})


class ClientListResource(Resource):
    @staticmethod
    def get():
        """Return a list of client"""

        clients = ClientRepo.get_list()
        return jsonify({"users": clients})
