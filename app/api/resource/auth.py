from flask_restful import Resource
from flask.json import jsonify
from flask import request
from flask_jwt_extended import create_access_token
from app.extension.redis import AuthCode, AuthToken
import string
import random

class AuthCodeRequest(Resource):
    @staticmethod
    def get():
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

        # check response_type
        if params['response_type'] != 'code':
            return jsonify({
                "message":"false",
            })
        
        # check credentials
        if params.get('username') is None or \
           params.get('password') is None:
            return jsonify({
                "error": {
                    "status": 401,
                    "detail": "unauthorized client",
                }
            })

        # get user id
        user_id = '123'

        # other condition

        # check state
        if params.get('state') != None:
            state = params['state']
        else:
            state = 'none'

        # generate code
        code = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(20))

        # save code for checking => chuyen thanh 1 module rieng
        AuthCode.save(code, params['client_id'], user_id, 600)

        return jsonify({
            "code":code,
            "user_id":user_id,
            "state":state
        })


class AuthTokenGrant(Resource):
    @staticmethod
    def get():
        params = request.form

        # validation
        if params.get('grant_type') is None or \
           params.get('code') is None or \
           params.get('redirect_uri') is None or \
           params.get('client_id') is None or \
           params.get('user_id') is None:
            return jsonify({
                "error": {
                    "status": 400,
                    "detail": "invalid request",
                }
            })

        if params.get('grant_type') != 'authorization_code':
            return jsonify({
                "error": {
                    "status": 405,
                    "detail": "unsupported response type",
                }
            })

        code = AuthCode.get(params['client_id'], params['user_id'])

        if code is None:
            return jsonify({
                "error": {
                    "status": 400,
                    "detail": "invalid request",
                }
            })

        # create access token
        additional_claims = {
            "roles":"",
            "scope":""
        }

        access_token = create_access_token(identity='username', additional_claims=additional_claims)
        expires_in = 3600

        # refresh_token
        refresh_token = ''

        AuthToken.saveAccessToken(access_token, expires_in, params['client_id'], params['user_id'])
        AuthToken.saveRefreshToken(refresh_token, params['client_id'], params['user_id'])

        return jsonify({
            "access_token":access_token,
            "token_type":"example",
            "expires_in":expires_in,
            "refresh_token":refresh_token,
            "id_token":"d213wdawda"
        })
