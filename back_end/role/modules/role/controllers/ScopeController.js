const scopeService = require("../services/ScopeService")
const responseTrait = require('../../../traits/responseTrait')

exports.getScopesFromRoleId = async (req, res) => {
    const roleId = req.params.roleId
    const scopes = await scopeService.getScopesFromRoleId(roleId)

    return responseTrait.ResponseSuccess(res, {
        scopes: scopes ? scopes : ''
    })
}