const tokenService = require("../services/TokenService")
const jwt = require('jsonwebtoken')

exports.Handle = async (req, res, next) => {
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
                detail: 'missing access token',
            }
        })
    }

    next()
}