const service = require("./service");
const helpers = require('../../helpers');
const iden = require('../identity/controller')
const randomstring = require("randomstring");
const Crypto = require("crypto-js");
const { json } = require("body-parser");

const ClientValidation = async (client_id, client_secret) => {
    // authenticate client
    const config = {
        id: client_id,
        client_secret: client_secret
    }

    const client = await service.getClient(config)
    
    return client
}

const UserValidation = async (username, password) => {
    // call to identity module and validate user
    const config = {
        username: username,
        password: password,
    }
    const user = await iden.AuthenUser(config)
    
    if (!user)
        return false

    return user.id
}

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

    const user_id = await UserValidation(data.username, data.password)
    if (!user_id)
        return res.status(401).json({
            error: {
                status: 401,
                detail: 'unauthorized user'
            }
        })

    // other condition

    // generate code
    // co the nen de rieng khai bao cac truong cua code
    const code = helpers.Generator.generateCode({
        user_id: user_id,
        client_id: data.client_id,
        scope: data?.scope,
        redirect_uri: data.redirect_uri,
        created_at: Math.floor(Date.now() / 1000),
    })

    // save code for checking
    helpers.Redis.saveAuthCode(code, data.client_id, user_id, process.env.AUTH_CODE_EXP)

    return res.status(200).json({
        code: code,
        user_id: user_id,
        state: data.state == null ? null : data.state,
    })
}

exports.TokenGrant = async (req, res) => {
    let id_token = ''
    let access_token = ''
    let refresh_token = ''
    const data = req.body
    
    if (data.grant_type != null && data.grant_type == 'refresh_token') {
        if (data.refresh_token == null ||
            data.client_id == null)
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: 'invalid request',
                }
            })
        
        // authenticate client
        const authorization = req.get('Authorization')

        if (authorization != null) {
            let arr = authorization.split(" ")
            const secret = arr[1];
            const client = await ClientValidation(data.client_id, secret)

            if (!client) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        detail: 'invalid client',
                    }
                })
            }
        } else {
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: 'invalid client',
                }
            })
        }

        const refresh_token = await helpers.Redis.getRefreshToken(data.client_id, data.user_id)
        
        if (refresh_token != data.refresh_token) {
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: "invalid refresh token",
                }
            })
        }

    } else if (data.grant_type != null && data.grant_type == 'authorization_code') {

        if (data.code == null ||
            data.redirect_uri == null ||
            data.client_id == null)
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: 'invalid request',
                }
            })

        // check redirect_uri
    
        // authenticate client
        const authorization = req.get('Authorization')

        if (authorization != null) {
            let arr = authorization.split(" ")
            const secret = arr[1];
            const client = await ClientValidation(data.client_id, secret)
    
            if (!client) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        detail: 'invalid client',
                    }
                })
            }
        } else {
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: 'invalid client',
                }
            })
        }
    
        // get code for checking
        const dataFromCode = helpers.Generator.getDataFromCode(data.code) ? helpers.Generator.getDataFromCode(data.code) : undefined

        const code = await helpers.Redis.getAuthCode(dataFromCode?.client_id, dataFromCode?.user_id)
    
        if (!code)
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: "code invalid!",
                }
            })
    
        if (code != data.code) {
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: "invalid code",
                }
            })
        } else {
            helpers.Redis.removeAuthCode(dataFromCode.client_id, dataFromCode.user_id)
        }

        if (data.redirect_uri != dataFromCode?.redirect_uri) {
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: "redirect_uri invalid!",
                }
            })
        }
        
        // create id token jwt payload
        if (dataFromCode.scope != undefined && dataFromCode.scope.includes("openid")) {
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
    } else {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid request',
            }
        })
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

    access_token = helpers.JWT.genToken(access_token_claims)
    refresh_token = randomstring.generate(30)

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
    
    const client_id = randomstring.generate(20)
    const client_secret = randomstring.generate(20)
    const hash = Crypto.SHA256(client_secret)
    
    const config = {
        id: client_id,
        client_secret: hash.toString(Crypto.enc.Hex),
        redirect_uri: data.redirect_uri,
        client_type: true,
        name: data.name,
        homepage_url: data.homepage_url,
        description: data.description != null ? data.description : null,
    }

    await service.createClient(config)

    return res.status(200).json({
        client_id: client_id,
        client_secret: client_secret
    })
}

exports.Test = async (req, res) => {
    const client = await ClientValidation('123', '123d')

    if (!client)
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid client',
            }
        })
    
    console.log("success! " + client)

    return res.status(200).json({
        data: client
    })
}