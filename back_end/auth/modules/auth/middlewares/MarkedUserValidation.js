const markedUserService = require('../services/MarkedUserService')
const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    const data = req.body
    const user_id = data.user_id
    
    const marked_user = await markedUserService.getMarkedUser(user_id)
    if (marked_user) {
        if (!marked_user.is_checked) {
            return responseTrait.Response(res, 400, "waiting for 2FA", null)
        }
    }
    next()
}