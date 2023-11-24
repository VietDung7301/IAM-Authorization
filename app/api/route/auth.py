from flask import Blueprint
from flask_restful import Api

from app.api.resource import AuthCodeRequest, AuthTokenGrant

AUTH_BLUEPRINT = Blueprint("auth", __name__)

# Api(AUTH_BLUEPRINT).add_resource(
#     AuthLogin, "/auth/login",
# )

Api(AUTH_BLUEPRINT).add_resource(
    AuthCodeRequest, "/auth/code",
)

Api(AUTH_BLUEPRINT).add_resource(
    AuthTokenGrant, "/auth/token",
)
