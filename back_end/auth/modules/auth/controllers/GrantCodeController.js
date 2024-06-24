const codeService = require("../services/CodeService")
const userMarkerService = require("../services/UserMarkerService")
const helpers = require('../../../helpers')
const responseTrait = require('../../../traits/responseTrait')

exports.authCodeGrant = async (req, res) => {
    try {
        const data = req.body
        const markedUser = await userMarkerService.getMarkedUser(data.user_id)
        // generate code
        const code = helpers.Generator.generateCode({
            user_id: data.user_id,
            client_id: data.client_id,
            scope: data?.scope,
            redirect_uri: data.redirect_uri,
            created_at: Math.floor(Date.now() / 1000),
        })

        // save code for checking
        await codeService.saveAuthCode(code, data.client_id, data.user_id, process.env.AUTH_CODE_EXP)

        return responseTrait.ResponseSuccess(res, {
            code: code,
            user_id: data.user_id,
            state: data.state == null ? null : data.state,
            otp: !markedUser || markedUser.is_checked ? false : true,
        })

    } catch (error) {
        console.log(error)
        return responseTrait.ResponseInternalServer(res)
    }
}