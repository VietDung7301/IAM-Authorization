from flask_restful import Resource
from flask.json import jsonify

class AuthLogin(Resource):
    @staticmethod
    def get():
        return jsonify({
            "code":"dwadawdadwa",
            "state":"ok"
        })

class AuthCodeRequest(Resource):
    @staticmethod
    def get(response_type, client_id, redirect_url, scope, state, response_mode, 
            nonce, display, prompt, max_age, ui_locales, id_token_hint, login_hint, acr_values):
        return "<h3>Code grant!</h3>"


class AuthTokenGrant(Resource):
    @staticmethod
    def get():
        return jsonify({
            "access_token":"2YotnFZFEjr1zCsicMWpAA",
            "token_type":"example",
            "expires_in":3600,
            "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
            "id_token":"d213wdawda"
        })
