const PermissionService = require("./services/PermissionService")
const responseTrait = require('../../traits/responseTrait')

exports.getScopesFromRoleId = async (req, res) => {
    const roleId = req.params.roleId
    const scopes = await PermissionService.getScopesFromRoleId(roleId)

    return responseTrait.ResponseSuccess(res, {
        scopes: scopes ? scopes : ''
    })
}

exports.checkPermission = async (req, res) => {
    // data = req.body

    if (data.url == null ||
        data.method == null ||
        data.scopes == null) {
            return responseTrait.ResponseInvalid(res)
    }

    const scopes = data.scopes.split(' ')
    const config = {
        url: data.url,
        method: data.method,
        scopes: scopes
    }

    return responseTrait.ResponseSuccess(res, {
        check: await PermissionService.checkPermission(config)
    })
}

exports.test = async (req, res) => {
    data = req.body

    if (data.url == null ||
        data.method == null ||
        data.scopes == null) {
            return res.status(400).json({
                detail: "invalid parameters"
            })
    }

    const scopes = data.scopes.split(' ')
    const config = {
        url: data.url,
        method: data.method,
        scopes: scopes
    }

    const check = await PermissionService.checkPermission(config)

    return res.status(200).json({
        "message": check
    })
}