const clientService = require("./services/ClientService");
const codeService = require("./services/CodeService")
const tokenService = require("./services/TokenService")
const helpers = require('../../helpers');
const randomstring = require("randomstring");
const Crypto = require("crypto-js");
const { json } = require("body-parser");
const { generateKeyPairSync, KeyObject } = require("node:crypto")
const { createPrivateKey } = require("crypto")
const jwt = require('jsonwebtoken')
const axios = require('axios');
const { response } = require("express");
const buffer = require('buffer');
const crypto = require('crypto');

const ClientValidation = async (client_id, client_secret) => {
    // authenticate client
    // const hash = Crypto.SHA256(client_secret)
    // const hashed_secret = hash.toString(Crypto.enc.Hex)

    const config = {
        id: client_id,
        client_secret: client_secret
    }

    const client = await clientService.getClient(config)
    
    return client
}

const UserValidation = async (username, password) => {
    // call to identity module and validate user
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/user/authen`, {
            username: username,
            password: password,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data.user.id
    } catch (error) {
        console.log(error)
        return false
    }
}

const getUser = async (user_id) => {
    try {
        const {data} = await axios.get(`${process.env.IDEN_URL}/api/iden/user/${user_id}`)
        return data.user
    } catch (error) {
        console.log(error)
        return false
    }
}

const getScope = async (user_id, scopes) => {
    // gọi role module để lấy scope
    const user = await getUser(user_id)
    if (!user)
        return ""
    
    if (!scopes)
        return ""
    
    try {
        const {data} = await axios.get(`${process.env.ROLE_URL}/api/get-scopes-from-role/${user.role_id}`)
        const req_scopes = scopes.split(' ')
        let valid_scopes = ''

        for (const req_scope of req_scopes) {
            if (data.scopes.includes(req_scope))
                valid_scopes = valid_scopes + req_scope + ' '
        }

        return valid_scopes.trim()
    } catch (error) {
        console.log(error)
        return ""
    }
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
    // validate redirect_uri
    const client = await clientService.getClient({id: data.client_id})
    if (!client) 
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'unknown client'
            }
        })

    const redirect_uri_arr = client.redirect_uri.split(',')
    if (!redirect_uri_arr.includes(data.redirect_uri))
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid redirect uri'
            }
        })

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
    await codeService.saveAuthCode(code, data.client_id, user_id, process.env.AUTH_CODE_EXP)

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
    let scope = ''
    let user_id = ''
    const data = req.body
    
    if (data.grant_type != null && data.grant_type == 'refresh_token') {
        if (data.refresh_token == null ||
            data.client_id == null ||
            data.user_id == null ||
            data.scope == null)
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

        const refresh_token = await tokenService.getRefreshToken(data.client_id, data.user_id)
        
        if (refresh_token != data.refresh_token) {
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: "invalid refresh token do token ko dong nhat",
                }
            })
        }

        // verify refresh token bang publicKey
        const public_key = await tokenService.getPublicKey(data.client_id, data.user_id)
        try {
            jwt.verify(refresh_token, public_key, function(err, decoded) {
                console.log(decoded.string)
            });
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: "invalid refresh token do public key",
                }
            })
        }

        // generate scope
        scope = await getScope(data.user_id, data.scope)
        user_id = data.user_id
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

        const code = await codeService.getAuthCode(dataFromCode?.client_id, dataFromCode?.user_id)
    
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
            await codeService.removeAuthCode(dataFromCode.client_id, dataFromCode.user_id)
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
            // call to identity module to get user
            const user = await getUser(data.user_id)

            if (user) {
                // id token claims
                const id_token_claims = {
                    iss: `https://${process.env.HOST}:${process.env.PORT}`,
                    sub: data.user_id,
                    aud: [
                        data.client_id,
                    ],
                    exp: Math.floor(Date.now() / 1000) + parseInt(process.env.TOKEN_EXP),
                    iat: Math.floor(Date.now() / 1000),
                    user
                }
        
                id_token = helpers.JWT.genToken(id_token_claims)
            }

        }

        // create scope
        scope = await getScope(dataFromCode.user_id, dataFromCode.scope)
        user_id = dataFromCode.user_id
    } else {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid request',
            }
        })
    }

    // create access token jwt payload + cần thêm claims về scopes
    const access_token_claims = {
        iss: `https://${process.env.HOST}:${process.env.PORT}`,
        exp: Math.floor(Date.now() / 1000) + parseInt(process.env.TOKEN_EXP),
        aud: [
            data.client_id,
        ],
        sub: user_id,
        client_id: data.client_id,
        scope: scope,
        iat: Math.floor(Date.now() / 1000),
        jti: 'jwtid'
    }
    // public key và private key
    const { publicKey, privateKey } = helpers.Generator.generateKeyPair()

    access_token = helpers.JWT.genAccessToken(access_token_claims, privateKey)
    refresh_token = helpers.JWT.genAccessToken({string: randomstring.generate(30)}, privateKey)

    await tokenService.savePublicKey(publicKey, data.client_id, user_id)
    await tokenService.saveRefreshToken(refresh_token, data.client_id, user_id)

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
        data.name == null )
        return res.status(400).json({
            error: {
                status: 400,
                detail: "invalid request",
            }
        })
    
    if (!Array.isArray(data.redirect_uri) || (Array.isArray(data.redirect_uri) && data.redirect_uri.length == 0))
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
        redirect_uri: data.redirect_uri.toString(),
        client_type: true,
        name: data.name,
        homepage_url: data.homepage_url,
        description: data.description != null ? data.description : null,
    }

    await clientService.createClient(config)

    return res.status(200).json({
        client_id: client_id,
        client_secret: client_secret
    })
}

exports.getPublicKey = async (req, res) => {
    const data = req.query

    if (data.client_id == null || 
        data.user_id == null)
        return res.status(405).json({
            error: {
                status: 405,
                detail: 'missing parameter'
            }
        })

    const public_key = await tokenService.getPublicKey(data.client_id, data.user_id)

    if (!public_key)
        return res.status(400).json({
            error: {
                status: 400,
                detail: "invalid request",
            }
        })
    
    return res.status(200).json({
        public_key: public_key
    })
}

exports.Logout = async (req, res) => {
    const data = req.body
    const authorization = req.get('Authorization')

    if (data.client_id == null || 
        data.user_id == null)
        return res.status(405).json({
            error: {
                status: 405,
                detail: 'missing parameter'
            }
        })
    
    if (authorization != null) {
        let arr = authorization.split(" ")
        const access_token = arr[1];
        try {
            const public_key = await tokenService.getPublicKey(data.client_id, data.user_id)
            jwt.verify(access_token, public_key)
        } catch (error) {
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: 'unauthorized request',
                }
            })
        }
    } else {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid request',
            }
        })
    }

    await tokenService.destroyAccessToken(data.client_id, data.user_id)

    return res.status(200).json({
        status:"logout successful"
    })
}

exports.Test = async (req, res) => {
    const data = req.query
    console.log(data)
    return res.status(200).json({
        msg: "msg"
    })
}