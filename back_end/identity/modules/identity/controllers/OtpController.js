const UserService = require("../services/UserService");
const OtpService = require("../services/OtpService")
const responseTrait = require('../../../traits/responseTrait')

exports.sendOtp = async (req, res) => {
    const data = req.body
    const user_id = data.user_id

    // basic validation
    if (!user_id || user_id == '') 
        return responseTrait.ResponseInvalid(res)

    const otp = OtpService.generateOtp()
    const result = await OtpService.saveOtp({
        user_id: user_id, 
        type: 1, 
        otp: otp, 
        is_used: 0, 
        expires: Math.round(new Date().getTime()/1000) + parseInt(process.env.OTP_EXPIRES)
    })
    if (!result) {
        return responseTrait.ResponseGeneralError(res, "cannot save otp")
    }
    // send otp
    const user = await UserService.getUser({id: user_id})
    const sentOtpResult = await OtpService.sendOtp({email: user.email, otp: otp})
    if (!sentOtpResult) {
        let count = 1
        while (count < process.env.RESEND_EMAIL_COUNT) {
            if (await OtpService.sendOtp({email: user.email, otp: otp})) {
                return responseTrait.ResponseSuccess(res, {
                    email: user.email
                })
            } else {
                count++
            }
        }
        return responseTrait.ResponseGeneralError(res, "cannot send otp")
    }
    return responseTrait.ResponseSuccess(res, {
        email: user.email
    })
}

exports.authenticateOtp = async (req, res) => {
    const data = req.body
    const config = {
        user_id: data.user_id,
        type: 1
    }
    const result = await OtpService.getOtp(config)
    if (!result) {
        return responseTrait.ResponseGeneralError(res, "cannot find otp")
    }

    console.log(result.expires)
    console.log(Math.round(new Date().getTime()/1000))
    if (result.is_used === 0 && Math.round(new Date().getTime()/1000) < result.expires && data.otp == result.otp) {
        await OtpService.saveOtp({
            user_id: data.user_id, 
            type: 1, 
            is_used: 1,
            otp: result.otp,
            expires: result.expires
        })
        return responseTrait.ResponseSuccess(res, {
            check: true
        })
    }
    return responseTrait.ResponseSuccess(res, {
        check: false
    })
}