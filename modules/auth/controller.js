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
    const code = helpers.CodeGen.generateCode(20, data.scope != null && data.scope.includes('openid') ? true : false)

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

    // authenticate client
    // get client_type
    // const client_type = true
    
    // if (client_type) {
    //     const authorization = req.get('Authorization')

    //     if (authorization != null) {
    //         let arr = authorization.split(" ")
    //         const secret = arr[1];

    //         // check secret == client_secret ?

    //         if (!false)
    //             return res.status(400).json({
    //                 error: {
    //                     status: 400,
    //                     detail: 'invalid client',
    //                 }
    //             })
    //     }
    //     else {
    //         return res.status(400).json({
    //             error: {
    //                 status: 400,
    //                 detail: 'invalid client',
    //             }
    //         })
    //     }
    // }

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
        //console.log('code ko dung ' + code)
        return res.status(400).json({
            error: {
                status: 400,
                detail: "invalid request",
            }
        })
    }
    
    // create id token jwt payload
    let arr = code.split('@')
    let id_token = ''
    if (arr[1] == 'oid') {
        // call to identity module
        const id_token_claims = {
            iss: `https://${process.env.HOST}:${process.env.PORT}`,
            sub: data.user_id,
            aud: [
                data.client_id,
            ],
            exp: Math.floor(Date.now() / 1000) + parseInt(process.env.TOKEN_EXP),
            iat: Math.floor(Date.now() / 1000),
            name: 'hoang anh',
            given_name: '',
            family_name: '',
            middle_name: '',
            nickname: '',
            preferred_username: 'wanderer',
            profile: '',
            picture: '',
            website: '',
            email: 'abc@gmail.com',
            email_verified: true,
            gender: 'male',
            birthdate: '',
            zoneinfo: '',
            locale: '',
            phone_number: '0123456789',
            phone_number_verified: true,
            address: {
                formatted: '',
                street_address: '',
                locality: '',
                region: '',
                postal_code: '',
                country: '',
            },
            updated_at: 123,
        }

        id_token = helpers.JWT.genToken(id_token_claims)
    }
    

    // create access token jwt payload
    const access_token_claims = {
        iss: `https://${process.env.HOST}:${process.env.PORT}`,
        exp: Math.floor(Date.now() / 1000) + parseInt(process.env.TOKEN_EXP),
        aud: [
            data.client_id,
        ],
        sub: data.user_id,
        client_id: data.client_id,
        iat: Math.floor(Date.now() / 1000),
        jti: 'jwtid'
    }

    const access_token = helpers.JWT.genToken(access_token_claims)
    const refresh_token = ''

    helpers.Redis.saveAccessToken(access_token, process.env.TOKEN_EXP, data.client_id, data.user_id)
    helpers.Redis.saveRefreshToken(refresh_token, data.client_id, data.user_id)

    return res.status(200).json({
        access_token: access_token,
        token_type: 'Bearer',
        expires_in: process.env.TOKEN_EXP,
        refresh_token: refresh_token,
        id_token: id_token,
    })
}

exports.RefreshToken = async (req, res) => {

}

exports.ClientRegistration = async (req, res) => {
    const data = req.body

    if (data.redirect_uri == null ||
        data.homepage_url == null ||
        data.name == null)
        return res.status(400).json({
            error: {
                status: 400,
                detail: "invalid request",
            }
        })
    
    const client_id = Math.floor(Math.random() * (9999 - 1) + 1);
    // const client_secret = '';
    
    const config = {
        id: client_id,
        client_secret: '123',
        redirect_uri: data.redirect_uri,
        client_type: true,
        name: data.name,
        homepage_url: data.homepage_url,
        description: data.description != null ? data.description : null,
    }

    await service.createClient(config)

    return res.status(200).json({
        client_secret: '123'
    })
}