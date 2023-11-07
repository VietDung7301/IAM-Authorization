from flask import Blueprint
from flask_restful import Api

from app.api.resource import AuthLogin, AuthCodeRequest, AuthTokenGrant

AUTH_BLUEPRINT = Blueprint("auth", __name__)

Api(AUTH_BLUEPRINT).add_resource(
    AuthLogin, "auth/login",
)

Api(AUTH_BLUEPRINT).add_resource(
    AuthCodeRequest, "auth/code?response_type=<string:response_type>& \
                                client_id=<string:client_id>& \
                                redirect_url=<string:redirect_url>& \
                                scope=<string:scope>& \
                                state=<string:state>& \
                                response_mode=<string:response_mode>& \
                                nonce=<string:nonce>& \
                                display=<string:display>& \
                                prompt=<string:prompt>& \
                                max_age=<string:max_age>& \
                                ui_locales=<string:ui_locales>& \
                                id_token_hint=<string:id_token_hint>& \
                                login_hint=<string:login_hint>& \
                                acr_values=<string:acr_values>",
)

Api(AUTH_BLUEPRINT).add_resource(
    AuthTokenGrant, "auth/token",
)