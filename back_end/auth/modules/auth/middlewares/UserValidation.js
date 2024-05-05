const axios = require('axios');
const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    const data = req.body

    if (data.username == null || data.password == null)
        return responseTrait.ResponseUnauthenticate(res)
    
    if (data.username == null || data.password == null)
        return responseTrait.ResponseUnauthenticate(res)

    const user_id = await UserValidation(data.username, data.password)
    if (!user_id)
        return responseTrait.ResponseUnauthenticate(res)
    
    // check fingerprint
    const result = await FingerprintValidation(user_id, data.fingerprint)
    if (!result || result.otp == undefined) {
        return res.status(500).json({
            error: {
                status: 500,
                detail: 'server error'
            }
        })
    }
    if (result.otp != '' || result.otp != null) {
        return res.status(422).json({
            error: {
                status: 422,
                detail: 'otp sent'
            }
        })
    }

    req.body.user_id = user_id
    next()

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

const FingerprintValidation = async (user_id, fingerprint) => {
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/fingerprint/authen`, {
            user_id: user_id,
            fingerprint: fingerprint,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data
    } catch (error) {
        console.log(error)
        return false
    }
}