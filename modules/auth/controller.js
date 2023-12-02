const service = require("./service");
const helpers = require('../../helpers');
const { json } = require("body-parser");

exports.AuthCodeGrant = async (req, res) => {
    const data = req.body

    if (data.response_type == null || 
        data.client_id == null ||
        data.redirect_uri == null)
        return res.status(405).json({
            error: {
                status: 405,
                detail: 'missing parameter'
            }
        })

    if (data.response_type != 'code')
        return res.status(405).json({
            error: {
                status: 405,
                detail: 'unsupported response type'
            }
        })

    if (data.username == null || data.password == null)
        return res.status(401).json({
            error: {
                status: 401,
                detail: 'unauthorized user'
            }
        })

    // call to identity module and validate user
    const user_id = '123'

    // other condition

    // generate code
    const code = helpers.CodeGen.generateCode(20)

    // save code for checking
    helpers.Redis.saveAuthCode(code, data.client_id, user_id, process.env.AUTH_CODE_EXP)

    return res.status(200).json({
        code: code,
        user_id: user_id,
        state: data.state == null ? null : data.state,
    })
}

exports.TokenGrant = async (req, res) => {
    const data = req.body

    if (data.grant_type == null ||
        data.code == null ||
        data.redirect_uri == null ||
        data.client_id == null ||
        data.user_id == null)
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid request',
            }
        })

    if (data.grant_type != 'authorization_code')
        return res.status(405).json({
            error: {
                status: 405,
                detail: "unsupported response type",
            }
        })

    // check client_type

    // get code for checking
    const code = await helpers.Redis.getAuthCode(data.client_id, data.user_id)

    if (!code)
        return res.status(400).json({
            error: {
                status: 400,
                detail: "code expired!",
            }
        })

    if (code != data.code) {
        console.log('code ko dung ' + code)
        return res.status(400).json({
            error: {
                status: 400,
                detail: "invalid request",
            }
        })
    } 
        

    // create jwt payload
    const claims = {
        iss: 'watashi',
        exp: Math.floor(Date.now() / 1000) + parseInt(process.env.TOKEN_EXP),
        aud: 'postman',
        sub: 'hoang anh',
        client_id: data.client_id,
        iat: Math.floor(Date.now() / 1000),
        jti: 'jwtid'
    }

    const access_token = helpers.JWT.genToken(claims)
    const refresh_token = ''

    helpers.Redis.saveAccessToken(access_token, process.env.TOKEN_EXP, data.client_id, data.user_id)
    helpers.Redis.saveRefreshToken(refresh_token, data.client_id, data.user_id)

    return res.status(200).json({
        access_token: access_token,
        token_type: 'Bearer',
        expires_in: process.env.TOKEN_EXP,
        refresh_token: refresh_token,
        id_token: 'dadacdaw21',
    })
}

exports.ClientRegistration = async (req, res) => {

}