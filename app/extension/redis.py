from app.extension import r

class AuthCode:
    @staticmethod
    def save(code, client_id, user_id, exp):
        key = client_id + user_id + 'code'
        content = {
            "code":code,
            "exp":exp
        }

        r.json().set(key, '$', content)
        r.expire(key, exp)


    @staticmethod
    def get(client_id, user_id):
        key = client_id + user_id + 'code'
        code = r.json().get(key, '$.code')
        exp = r.json().get(key, '$.exp')
        
        return code


class AuthToken:
    @staticmethod
    def saveAccessToken(access_token, expires_in, client_id, user_id):
        key = client_id + user_id + 'AccessToken'
        content = {
            "token":access_token,
            "expire_in":expires_in
        }

        r.json().set(key, '$', content)
        r.expire(key, expires_in)

    
    @staticmethod
    def saveRefreshToken(refresh_token, client_id, user_id):
        key = client_id + user_id + 'RefreshToken'
        content = {
            "token":refresh_token
        }

        r.json().set(key, '$', content)

