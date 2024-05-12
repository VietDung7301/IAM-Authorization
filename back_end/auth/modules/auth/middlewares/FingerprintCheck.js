const axios = require('axios');
const responseTrait = require('../../../traits/responseTrait')
const markedUserService = require('../services/MarkedUserService')

exports.Handle = async (req, res, next) => {
    console.log('fingerprint check')
    const data = req.body
    const user_id = data.user_id
    const fingerprint = data.fingerprint
    
    // check fingerprint
    const result = await fingerprintValidation(user_id, fingerprint)
    if (!result || result.check == undefined || !result.check) {
        const marked_user = await markedUserService.getMarkedUser(user_id)
        if (marked_user?.is_checked && marked_user?.last_2FA_at == fingerprint) {
            if (fingerprint) { 
                await saveFingerprint(fingerprint, user_id) 
            }
        } else {
            // create record
            await markedUserService.markedUser(user_id)
        }
    }
    next()
}

const fingerprintValidation = async (user_id, fingerprint) => {
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/fingerprint/authen`, {
            user_id: user_id,
            fingerprint: fingerprint,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data.data
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