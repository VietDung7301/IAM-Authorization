const UserService = require("../services/UserService");
const LinkedAccountService = require("../services/LinkedAccountService")
const responseTrait = require('../../../traits/responseTrait')

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