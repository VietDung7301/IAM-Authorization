from flask_restful import Resource
from flask.json import jsonify
from flask import request
from flask_jwt_extended import create_access_token
from app.extension.redis import AuthCode, AuthToken
from app.repository.client import ClientRepo
import config
import string
import random

class AuthCodeRequest(Resource):
    @staticmethod
    def post():
        params = request.form

        # validate params
        if params.get('response_type') is None or \
           params.get('client_id') is None or \
           params.get('redirect_uri') is None:
            return {
                "error": {
                    "status": 405,
                    "detail": "unsupported response type",
                }
            }, 405

        # check response_type
        if params['response_type'] != 'code':
            return {
                "error": {
                    "status": 405,
                    "detail": "unsupported response type",
                }
            }, 405
        
        # check credentials
        if params.get('username') is None or \
           params.get('password') is None:
            return {
                "error": {
                    "status": 401,
                    "detail": "unauthorized user",
                }
            }, 401

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

        # save code for checking
        AuthCode.save(code, params['client_id'], user_id, config.AUTH_CODE_EXP)

        return {
            "code": code,
            "user_id": user_id,
            "state": state
        }


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
            return {
                "error": {
                    "status": 400,
                    "detail": "invalid request",
                }
            }, 400

        if params.get('grant_type') != 'authorization_code':
            return {
                "error": {
                    "status": 405,
                    "detail": "unsupported response type",
                }
            }, 405

        # get client_type from client_id
        # client = ClientRepo.get(params['client_id'])
        # if (client.client_type == 1):
        #     headers = request.headers
        #     if (headers['Authorization'] != client.client_secret):
        #         return jsonify({
        #             "error": {
        #                 "status": 401,
        #                 "detail": "unauthorized client",
        #             }
        #         })

        # get code for checking
        code = AuthCode.get(params['client_id'], params['user_id'])

        if code is None:
            return {
                "error": {
                    "status": 400,
                    "detail": "invalid request",
                }
            }, 400

        if params['code'] != code:
            return {
                "error": {
                    "status": 400,
                    "detail": "invalid request",
                }
            }, 400

        # create access token
        roles = ''
        scope = ''

        additional_claims = {
            "roles": roles,
            "scope": scope
        }

        access_token = create_access_token(identity='username', additional_claims=additional_claims)

        # refresh_token
        refresh_token = ''

        AuthToken.saveAccessToken(access_token, config.TOKEN_EXP, params['client_id'], params['user_id'])
        AuthToken.saveRefreshToken(refresh_token, params['client_id'], params['user_id'])

        return {
            "access_token": access_token,
            "token_type": "example",
            "expires_in": config.TOKEN_EXP,
            "refresh_token": refresh_token,
            "id_token": "d213wdawda"
        }


class ClientRegister(Resource):
    @staticmethod
    def get():
        return True
