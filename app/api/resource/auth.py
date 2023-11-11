from flask_restful import Resource
from flask.json import jsonify
from flask import request
import string
import random

class AuthLogin(Resource):
    @staticmethod
    def post():
        # lay ra duoc username va pwd | form_data
        data = request.form

        # check credentials
        if data.get('username') is None or \
           data.get('password') is None:
            return jsonify({
                "error": {
                    "status": 401,
                    "detail": "unauthorized client",
                }
            })

        if data.get('state') != None:
            state = data['state']
        else:   
            state = 'none'

        # generate code
        code = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(10))

        return jsonify({
            "code":code,
            "state":state
        })

class AuthCodeRequest(Resource):
    @staticmethod
    def post():
        params = request.form

        # validate params
        if params.get('response_type') is None or \
           params.get('client_id') is None or \
           params.get('redirect_url') is None:
            return jsonify({
                "error": {
                    "status": 405,
                    "detail": "unsupported response type",
                }
            })

        if params['response_type'] != 'code':
            return jsonify({
                "message":"false",
            })

        # other condition

        # check state
        if params.get('state') != None:
            state = params['state']
        else:
            state = 'none'

        return jsonify({
            "message":"success",
            "state": state
        })


class AuthTokenGrant(Resource):
    @staticmethod
    def get():
        # check code, client_id, redirect_url

        return jsonify({
            "access_token":"2YotnFZFEjr1zCsicMWpAA",
            "token_type":"example",
            "expires_in":3600,
            "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
            "id_token":"d213wdawda"
        })
