const tokenService = require("../services/TokenService")
const jwt = require('jsonwebtoken')
const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    console.log('token authentication')
    const data = req.body
    const authorization = req.get('Authorization')
    // const authorization = data.Authorization
    
    if (authorization) {
        let arr = authorization.split(" ")
        const access_token = arr[1];
        try {
            const decoded = jwt.decode(access_token)
            const public_key = await tokenService.getAccessKey(decoded.jti, decoded.sub)
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