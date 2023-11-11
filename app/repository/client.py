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
    def update(cls, id, client_type, client_secret, redirect_url):
        """ Update a client infor by its id """
        client = cls.get(id)
        client.redirect_url = redirect_url
        client.client_type = client_type
        client.client_secret = client_secret

        return client.save()

    @staticmethod
    def create(client_secret, redirect_url, client_type):
        """ Create a new client """
        client = ClientModel(client_secret, redirect_url, client_type)

        return client.save()
