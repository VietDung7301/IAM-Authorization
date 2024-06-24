const FingerprintService = require("../services/FingerprintService")
const responseTrait = require('../../../traits/responseTrait')

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