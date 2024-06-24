const codeService = require("../services/CodeService")
const tokenService = require("../services/TokenService")
const userService = require('../services/UserService')
const scopeService = require('../services/ScopeService')
const helpers = require('../../../helpers');
const jwt = require('jsonwebtoken')
const responseTrait = require('../../../traits/responseTrait')
const otpGenerator = require('otp-generator')

exports.tokenGrant = async (req, res) => {
    let id_token = ''
    let id_token_pub_key = ''
    let access_token = ''
    let refresh_token = ''
    let scope = ''
    let user_id = ''
    let jti = ''
    const data = req.body

    try {
        if (data.grant_type != null && data.grant_type == 'refresh_token') {
            if (data.refresh_token == null ||
                data.client_id == null ||
                data.user_id == null)
                return responseTrait.ResponseInvalid(res)
            
            let openid = false
            const unverifiedDecoded = jwt.decode(data.refresh_token)
            const refreshPubKey = await tokenService.getRefreshKey(unverifiedDecoded?.jti, data.user_id)
            
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
    
            // revoke tokens
            await tokenService.destroyAccessToken(unverifiedDecoded?.jti, data.user_id)
            await tokenService.destroyRefreshToken(unverifiedDecoded?.jti, data.user_id)
    
            // generate id token if needed
            user_id = data.user_id
            if (openid) {
                const user = await userService.getUser(user_id)
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

            // check number of current login devices
            const maxDevice = process.env.MAX_KEY_FOR_TOKEN || 5
            if (await tokenService.countKeyNumber(dataFromCode.user_id) >= maxDevice) {
                return responseTrait.Response(res, 400, "reach maximum login devices!", null)
            }
            
            // create id token jwt payload
            if (dataFromCode.scope != undefined && dataFromCode.scope.includes("openid")) {
                // call to identity module to get user
                const user = await userService.getUser(dataFromCode.user_id)
    
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
            scope = await scopeService.getScope(dataFromCode.user_id, dataFromCode.scope)
            user_id = dataFromCode.user_id
        } else {
            return responseTrait.ResponseInvalid(res)
        }
    
        // create access token
        jti = otpGenerator.generate(10, {
            lowerCaseAlphabets: true,
            upperCaseAlphabets: true,
            specialChars: false,
        })
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
            jti: jti,
        }, refreshKeyPair.privateKey)
    
        await tokenService.saveAccessKey(accessKeyPair.publicKey, jti, user_id, process.env.TOKEN_EXP)
        await tokenService.saveRefreshKey(refreshKeyPair.publicKey, jti, user_id, process.env.REFRESH_TOKEN_EXP)
    
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
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}