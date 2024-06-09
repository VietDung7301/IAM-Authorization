const clientService = require("./services/ClientService");
const codeService = require("./services/CodeService")
const tokenService = require("./services/TokenService")
const markedUserService = require("./services/MarkedUserService")
const helpers = require('../../helpers');
const randomstring = require("randomstring");
const jwt = require('jsonwebtoken')
const axios = require('axios');
const responseTrait = require('../../traits/responseTrait')

const getUser = async (user_id) => {
    try {
        const {data} = await axios.get(`${process.env.IDEN_URL}/api/iden/user/${user_id}`)
        return data.data.user
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
            if (data.data.scopes.includes(req_scope))
                valid_scopes = valid_scopes + req_scope + ' '
        }

        return valid_scopes.trim()
    } catch (error) {
        console.log(error)
        return ""
    }
}

exports.authCodeGrant = async (req, res) => {
    try {
        const data = req.body
        const markedUser = await markedUserService.getMarkedUser(data.user_id)
        // generate code
        const code = helpers.Generator.generateCode({
            user_id: data.user_id,
            client_id: data.client_id,
            scope: data?.scope,
            redirect_uri: data.redirect_uri,
            created_at: Math.floor(Date.now() / 1000),
        })

        // save code for checking
        await codeService.saveAuthCode(code, data.client_id, data.user_id, process.env.AUTH_CODE_EXP)

        return responseTrait.ResponseSuccess(res, {
            code: code,
            user_id: data.user_id,
            state: data.state == null ? null : data.state,
            otp: !markedUser || markedUser.is_checked ? false : true,
        })

    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}

exports.tokenGrant = async (req, res) => {
    let id_token = ''
    let id_token_pub_key = ''
    let access_token = ''
    let refresh_token = ''
    let scope = ''
    let user_id = ''
    let jti = 'jwtid'
    const data = req.body
    
    if (data.grant_type != null && data.grant_type == 'refresh_token') {
        if (data.refresh_token == null ||
            data.client_id == null ||
            data.user_id == null)
            return responseTrait.ResponseInvalid(res)
        
        let openid = false
        const refreshPubKey = await tokenService.getRefreshToken(data.client_id, data.user_id)
        
        try {
            jwt.verify(data.refresh_token, refreshPubKey, function(err, decoded) {
                if (!decoded) {
                    throw new Error("cannot decode refresh token!");
                }
                scope = decoded.scope
                openid = decoded.openid
            });
        } catch (error) {
            console.log(error)
            return responseTrait.Response(res, 400, "refresh token invalid!", null)
        }

        // generate id token if needed
        user_id = data.user_id
        if (openid) {
            const user = await getUser(user_id)
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
                const keyPair = helpers.Generator.generateKeyPair()
                id_token_pub_key = keyPair.publicKey
                id_token = helpers.JWT.genAccessToken(id_token_claims, keyPair.privateKey)
            }
        }
    } else if (data.grant_type != null && data.grant_type == 'authorization_code') {

        if (data.code == null ||
            data.redirect_uri == null ||
            data.client_id == null)
            return responseTrait.ResponseInvalid(res)
    
        // get code for checking
        const dataFromCode = helpers.Generator.getDataFromCode(data.code) ? helpers.Generator.getDataFromCode(data.code) : undefined

        const code = await codeService.getAuthCode(dataFromCode?.client_id, dataFromCode?.user_id)
    
        if (!code)
            return responseTrait.Response(res, 400, "authorization code not found!", null)
    
        if (code != data.code) {
            return responseTrait.Response(res, 400, "authorization code invalid!", null)
        } else {
            await codeService.removeAuthCode(dataFromCode.client_id, dataFromCode.user_id)
        }

        if (data.redirect_uri != dataFromCode?.redirect_uri) {
            return responseTrait.Response(res, 400, "redirect url invalid!", null)
        }
        
        // create id token jwt payload
        if (dataFromCode.scope != undefined && dataFromCode.scope.includes("openid")) {
            // call to identity module to get user
            const user = await getUser(dataFromCode.user_id)

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
                const  keyPair  = helpers.Generator.generateKeyPair()
                id_token_pub_key = keyPair.publicKey
                id_token = helpers.JWT.genAccessToken(id_token_claims, keyPair.privateKey)
            }
        }

        // create scope
        scope = await getScope(dataFromCode.user_id, dataFromCode.scope)
        user_id = dataFromCode.user_id
    } else {
        return responseTrait.ResponseInvalid(res)
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
        jti: jti,
    }
    // public key và private key
    const accessKeyPair = helpers.Generator.generateKeyPair()
    const refreshKeyPair = helpers.Generator.generateKeyPair()

    access_token = helpers.JWT.genAccessToken(access_token_claims, accessKeyPair.privateKey)
    refresh_token = helpers.JWT.genAccessToken({
        openid: id_token !== '', 
        scope: scope,
        // openid: {
        //     id_token: id_token,
        //     id_token_pub_key: id_token_pub_key,
        // },
        jti: jti,
    }, refreshKeyPair.privateKey)

    await tokenService.savePublicKey(accessKeyPair.publicKey, data.client_id, user_id, process.env.TOKEN_EXP)
    await tokenService.saveRefreshToken(refreshKeyPair.publicKey, data.client_id, user_id, process.env.REFRESH_TOKEN_EXP)

    return responseTrait.ResponseSuccess(res, {
        access_token: access_token,
        token_type: 'Bearer',
        expires_in: process.env.TOKEN_EXP,
        refresh_token: refresh_token,
        openid: {
            id_token: id_token,
            id_token_pub_key: id_token_pub_key,
        },
    })
}

exports.logout = async (req, res) => {
    const data = req.body
    try {
        await tokenService.destroyAccessToken(data.client_id, data.user_id)
        await tokenService.destroyRefreshToken(data.client_id, data.user_id)

        return responseTrait.ResponseSuccess(res, null)
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}

exports.sendOtp = async (req, res) => {
    const data = req.body
    const user_id = data.user_id

    if (!user_id || user_id == '') {
        return responseTrait.ResponseInvalid(res)
    }

    const marked_user = await markedUserService.getMarkedUser(user_id)
    if (!marked_user || marked_user.is_checked) {
        return responseTrait.ResponseInvalid(res)
    }

    // call api send otp
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/otp/send`, {
            user_id: user_id,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (data.status_code != 200) {
            return responseTrait.Response(res, 502, "send otp failed!", null)  
        }
        return responseTrait.ResponseSuccess(res, data.data)
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}

exports.authenticateOtp = async (req, res) => {
    const data = req.body
    const user_id = data.user_id
    const otp = data.otp
    const fingerprint = data?.fingerprint

    if (!user_id || user_id == '' ||
        !otp || otp == '') {
        return responseTrait.ResponseInvalid(res)
    }

    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/otp/authen`, {
            otp: otp,
            user_id: user_id,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const check  = data.data.check
        if (check) {
            const unMarkedUser = await markedUserService.unMarkedUser(user_id, fingerprint)
            if (!unMarkedUser) {
                return responseTrait.ResponseInternalServer(res)
            }
        }
        return responseTrait.ResponseSuccess(res, {
            check: check
        })
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}