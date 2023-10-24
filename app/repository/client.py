""" Defines the User repository """
from sqlalchemy.exc import MultipleResultsFound

from app.model import ClientModel


class ClientRepo:
    """ The repository for the client model """

    @staticmethod
    def get(id):
        """ Query a client by id """
        try:
            return ClientModel.query.filter_by(id=id).one_or_none()
        except MultipleResultsFound:
            return None

    @staticmethod
    def get_list():
        """ Get a list of client. """

        return ClientModel.query.all()

    @classmethod
    def update(cls, id, type, credential):
        """ Update a client infor by its id """
        client = cls.get(id)
        client.type = type
        client.credential = credential

        return client.save()

    @staticmethod
    def create(type, credential):
        """ Create a new client """
        client = ClientModel(type, credential)

        return client.save()
