const UserService = require("./services/UserService");
const FingerprintService = require("./services/FingerprintService")
const OtpService = require("./services/OtpService")
const LinkedAccountService = require("./services/LinkedAccountService")
const randomStr = require("randomstring")
const responseTrait = require('../../traits/responseTrait')
const bcrypt = require('bcrypt')

exports.getAll = async (req, res) => {
    return responseTrait.ResponseSuccess(res, {
        users: await UserService.getAll()
    })
}

exports.getUser = async (req, res) => {
    const id = req.params.id
    const query = req.query
    const config = {
        id: id
    }
    const user = await UserService.getUser(config)

    if (!user)
        return responseTrait.ResponseNotFound(res)

    if (query.claims) {
        let claims = query.claims.split(',')
        for (const [key, value] of Object.entries(user.dataValues)) {
            if (!claims.includes(key)) {
                delete user.dataValues[key]
            }
        }
    }

    if (user.dataValues.password) delete user.dataValues.password
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
    try {
        const data = req.body
        const config = {
            username: data.username,
        }
        const user = await UserService.getUser(config)
        if (!user) {
            return responseTrait.ResponseNotFound(res)
        }
        if (!await bcrypt.compare(data.password, user.password))
            return responseTrait.ResponseNotFound(res)

        delete user.dataValues.password
        return responseTrait.ResponseSuccess(res, {
            user:user.dataValues
        })
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseNotFound(res)
    }
}

exports.authenticateLinkedAccount = async (req, res) => {
    try {
        const data = req.body
        const config = {
            provider: data.iss,
            sub: data.sub
        }
        console.log('config', config)
        const linkedAccount = await LinkedAccountService.getAccount(config)
        if (!linkedAccount) {
            return responseTrait.ResponseNotFound(res)
        }
        const user = await UserService.getUser({id: linkedAccount.user_id})
        delete user.dataValues.password
        return responseTrait.ResponseSuccess(res, {
            user:user.dataValues
        })
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseNotFound(res)
    }
}

exports.authenticateFingerprint = async (req, res) => {
    const data = req.body
    const fingerprint = data.fingerprint
    const user_id = data.user_id

    // basic validation
    if (!user_id || user_id == '') 
        return responseTrait.ResponseInvalid(res)

    const fingerprints = await FingerprintService.getFingerprints({user_id: user_id})
    if (fingerprints) {
        const fingerprintsArr = fingerprints.split(',')
        if (fingerprintsArr.includes(fingerprint)) {
            return responseTrait.ResponseSuccess(res, {
                check: true
            })
        } else {
            return responseTrait.ResponseSuccess(res, {
                check: false
            })
        }
    }

    return responseTrait.ResponseSuccess(res, {
        check: false
    })
}

exports.saveFingerprint = async (req, res) => {
    const data = req.body
    const fingerprint = data.fingerprint
    const user_id = data.user_id
    const payload = {
        user_id: user_id,
        fingerprints: null,
    }

    // basic validation
    if ((!fingerprint || !user_id) || (fingerprint == '' || user_id == '')) 
        return responseTrait.ResponseInvalid(res)
    
    const fingerprints = await FingerprintService.getFingerprints({user_id: user_id})
    if (fingerprints) {
        const fingerprintsArr = fingerprints.split(',')
        if (fingerprintsArr.length >= process.env.MAX_FINGERPRINTS) {
            fingerprintsArr.shift()
        }
        fingerprintsArr.push(fingerprint)
        payload.fingerprints = fingerprintsArr.toString() 
    } else {
        payload.fingerprints = fingerprint
    }
    const result = await FingerprintService.saveFingerprint(payload)
    if (!result) {
        return responseTrait.ResponseGeneralError(res, "cannot save fingerprint")
    }   
    return responseTrait.ResponseSuccess(res, null)
}

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
                    otp: otp
                })
            } else {
                count++
            }
        }
        return responseTrait.ResponseGeneralError(res, "cannot send otp")
    }
    return responseTrait.ResponseSuccess(res, {
        otp: otp
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