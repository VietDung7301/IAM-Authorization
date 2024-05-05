const axios = require('axios')

exports.Handle = async (req, res, next) => {
    const data = req.body
    
    if (data.otp == null || data.fingerprint == null) {
        return res.status(401).json({
            error: {
                status: 401,
                detail: 'invalid request'
            }
        })
    }

    const otpValid = await OtpValidation(data.otp, data.user_id)
    if (!otpValid)
        return res.status(500).json({
            error: {
                status: 500,
                detail: 'server error'
            }
        })
    if (!otpValid.check)
        return res.status(401).json({
            error: {
                status: 401,
                detail: 'unauthorized'
            }
        })

    await saveFingerprint(data.fingerprint, data.user_id)
    req.body.user_id = data.user_id
    next()
}

const OtpValidation = async (otp, user_id) => {
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/otp/authen`, {
            otp: otp,
            user_id: user_id,
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

const saveFingerprint = async (fingerprint, user_id) => {
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/fingerprint/save`, {
            user_id: user_id,
            fingerprint: fingerprint,
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}