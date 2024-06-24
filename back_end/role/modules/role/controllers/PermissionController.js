const permissionService = require("../services/PermissionService")
const responseTrait = require('../../../traits/responseTrait')

exports.checkPermission = async (req, res) => {
    try {
        const data = req.body

        if (data.url == null ||
            data.method == null ||
            data.scopes == null) {
                return responseTrait.ResponseInvalid(res)
        }
    
        const url = new URL(data.url)
        const scopes = data.scopes.split(' ')
        const config = {
            url: url.origin + url.pathname,
            method: data.method,
            scopes: scopes
        }
    
        return responseTrait.ResponseSuccess(res, {
            check: await permissionService.checkPermission(config)
        })
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseSuccess(res, {
            check: false
        })
    }
}