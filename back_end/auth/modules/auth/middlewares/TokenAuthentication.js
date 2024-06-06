const tokenService = require("../services/TokenService")
const jwt = require('jsonwebtoken')
const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    console.log('token authentication')
    const data = req.body
    const authorization = req.get('Authorization')

    if (data.client_id == null || 
        data.user_id == null)
        return responseTrait.ResponseUnauthenticate(res)
    
    if (authorization != null) {
        let arr = authorization.split(" ")
        const access_token = arr[1];
        try {
            const public_key = await tokenService.getPublicKey(data.client_id, data.user_id)
            jwt.verify(access_token, public_key)
        } catch (error) {
            console.log(error)
            return responseTrait.ResponseUnauthenticate(res)
        }
    } else {
        return responseTrait.ResponseUnauthenticate(res)
    }

    next()
}