const userMarkerService = require("../services/UserMarkerService")
const axios = require('axios');
const responseTrait = require('../../../traits/responseTrait')

exports.sendOtp = async (req, res) => {
    const data = req.body
    const user_id = data.user_id

    if (!user_id || user_id == '') {
        return responseTrait.ResponseInvalid(res)
    }

    const marked_user = await userMarkerService.getMarkedUser(user_id)
    if (!marked_user || marked_user.is_checked) {
        return responseTrait.ResponseInvalid(res)
    }

    // call api send otp
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/otp/send`, {
            user_id: user_id,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (data.status_code != 200) {
            return responseTrait.Response(res, 502, "send otp failed!", null)  
        }
        return responseTrait.ResponseSuccess(res, data.data)
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}

exports.authenticateOtp = async (req, res) => {
    const data = req.body
    const user_id = data.user_id
    const otp = data.otp
    const fingerprint = data?.fingerprint

    if (!user_id || user_id == '' ||
        !otp || otp == '') {
        return responseTrait.ResponseInvalid(res)
    }

    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/otp/authen`, {
            otp: otp,
            user_id: user_id,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        const check  = data.data.check
        if (check) {
            const unMarkedUser = await userMarkerService.unMarkedUser(user_id, fingerprint)
            if (!unMarkedUser) {
                return responseTrait.ResponseInternalServer(res)
            }
        }
        return responseTrait.ResponseSuccess(res, {
            check: check
        })
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}