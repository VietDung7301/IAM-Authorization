const PermissionService = require("./services/PermissionService")

exports.checkPermission = async (req, res) => {
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

    return res.status(200).json({
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