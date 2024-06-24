const tokenService = require("../services/TokenService")
const jwt = require('jsonwebtoken')
const responseTrait = require('../../../traits/responseTrait')

exports.logout = async (req, res) => {
    const data = req.body
    try {
        // const authorization = req.get('Authorization')
        const authorization = data.Authorization
        let arr = authorization.split(" ")
        const access_token = arr[1];
        const decoded = jwt.decode(access_token)

        await tokenService.destroyAccessToken(decoded.jti, decoded.sub)
        await tokenService.destroyRefreshToken(decoded.jti, decoded.sub)

        return responseTrait.ResponseSuccess(res, null)
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}

exports.logoutAll = async (req, res) => {
    const data = req.body
    try {
        // const authorization = req.get('Authorization')
        const authorization = data.Authorization
        let arr = authorization.split(" ")
        const access_token = arr[1];
        const decoded = jwt.decode(access_token)

        await tokenService.destroyAllKey(decoded.sub)

        return responseTrait.ResponseSuccess(res, null)
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}