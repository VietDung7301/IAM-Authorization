const markedUserService = require('../services/MarkedUserService')
const responseTrait = require('../../../traits/responseTrait')
const helpers = require('../../../helpers')

exports.Handle = async (req, res, next) => {
    const data = req.body
    let user_id = ''
    if (data.grant_type == 'authorization_code') {
        const dataFromCode = helpers.Generator.getDataFromCode(data.code) ? helpers.Generator.getDataFromCode(data.code) : undefined
        user_id = dataFromCode?.user_id
    } else {
        user_id = data.user_id
    }
    
    const marked_user = await markedUserService.getMarkedUser(user_id)
    if (marked_user) {
        if (!marked_user.is_checked) {
            return responseTrait.Response(res, 400, "waiting for 2FA", null)
        }
    }
    next()
}