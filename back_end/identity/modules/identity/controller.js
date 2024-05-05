const UserService = require("./services/UserService");
const FingerprintService = require("./services/FingerprintService")
const OtpService = require("./services/OtpService")
const randomStr = require("randomstring")
const responseTrait = require('../../traits/responseTrait')

exports.getAll = async (req, res) => {
    return responseTrait.ResponseSuccess(res, {
        users: await UserService.getAll()
    })
}

exports.getUser = async (req, res) => {
    const id = req.params.id
    const config = {
        id: id
    }
    const user = await UserService.getUser(config)

    if (!user)
        return responseTrait.ResponseNotFound(res)

    return responseTrait.ResponseSuccess(res, {
        user:user
    })
}

exports.createUser = async (req, res) => {
    const data = req.body
    // validation

    data.id = randomStr.generate(10)
    const user = await UserService.createUser(data)
    if (!user)
        return responseTrait.ResponseInternalServer(res)
    
    return responseTrait.ResponseSuccess(res, {
        user:user
    })
}

exports.updateUser = async (req, res) => {
    const id = req.params.id
    const config = {
        id: id
    }
    const data = req.body
    // validate

    const result = await UserService.updateUser(config, data)
    if (!result)
        return responseTrait.ResponseInternalServer(res)
    
    return responseTrait.ResponseSuccess(res, {
        result:result
    })
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id
    const config = {
        id: id
    }

    const result = await UserService.deleteUser(config)
    if (!result)
        return responseTrait.ResponseInternalServer(res)

    return responseTrait.ResponseSuccess(res, {
        deleted_user:result
    })
}

exports.authenticateUser = async (req, res) => {
    const data = req.body
    const config = {
        username: data.username,
        password: data.password,
    }
    const user = await UserService.getUser(config)

    if (!user)
        return responseTrait.ResponseNotFound(res)

    return responseTrait.ResponseSuccess(res, {
        user:user
    })
}

exports.authenticateFingerprint = async (req, res) => {
    const data = req.body
    const fingerprint = data.fingerprint
    const user_id = data.user_id
    const config = {
        user_id: user_id
    }

    const fingerprints = await FingerprintService.getFingerprints(config)
    if (fingerprints == false) {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'cannot find fingerprint'
            }
        })
    }

    for (const [key, value] of Object.entries(fingerprints.dataValues)) {
        if (key != 'user_id' && value == fingerprint) {
            return res.status(200).json({
                otp: ''
            })
        }
    }
    const otp = OtpService.generateOtp()
    const result = await OtpService.saveOtp({
        user_id: user_id, 
        type: 1, 
        otp: otp, 
        is_used: 0, 
        expires: new Date().getTime() + process.env.OTP_EXPIRES
    })
    if (!result) {
        return res.status(500).json({
            error: {
                status: 500,
                detail: 'cannot save otp'
            }
        })
    }
    // send otp
    const user = await UserService.getUser({id: user_id})
    // có thể cần gửi lại liên tục trong 1 khoảng nhất định
    const sentOtpResult = await OtpService.sendOtp({email: user.email, otp: otp})
    if (!sentOtpResult) {
        return res.status(500).json({
            error: {
                status: 500,
                detail: 'cannot send otp'
            }
        })
    }
    return res.status(200).json({
        otp: otp
    })
}

exports.saveFingerprint = async (req, res) => {
    const data = req.body
    const fingerprint = data.fingerprint
    const user_id = data.user_id
    const config = {
        user_id: user_id
    }
    const fingerprints = await FingerprintService.getFingerprints(config)
    if (fingerprints == false) {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'cannot find fingerprint'
            }
        })
    }
    let assigned = 0
    for (const [key, value] of Object.entries(fingerprints.dataValues)) {
        if (key != 'user_id' && (value == null || value == '')) {
            fingerprints.dataValues[key] = fingerprint
            assigned = 1 
            break
        }
    }
    if (!assigned) {
        //luôn bị gán vào device 1 (!)
        fingerprints.fingerprint_1 = fingerprint
    }
    const result = await FingerprintService.saveFingerprint(fingerprints.dataValues)
    if (!result) {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'cannot save fingerprint'
            }
        })
    }   
    return res.status(200).json({})
}

exports.authenticateOtp = async (req, res) => {
    const data = req.body
    const config = {
        user_id: data.user_id,
        type: 1
    }
    const result = await OtpService.getOtp(config)
    if (!result) {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'cannot find otp'
            }
        })
    }

    if (result.is_used === 0 && new Date().getTime() < result.expires && data.otp == result.otp) {
        await OtpService.saveOtp({
            user_id: data.user_id, 
            type: 1, 
            is_used: 1,
            otp: result.otp,
            expires: result.expires
        })
        return res.status(200).json({
            check: true
        })
    }
    return res.status(200).json({
        check: false
    })
}