exports.Response = (res, status, msg, data) => {
    return res.status(status).json({
        status_code: status,
        message: msg,
        data: data
    })
}

exports.ResponseSuccess = (res, data) => {
    return this.Response(res, 200, "success", data)
}

exports.ResponseInvalid = (res) => {
    return this.Response(res, 400, "invalid request", null)
}

exports.ResponseUnauthenticate = (res) => {
    return this.Response(res, 401, "unauthorized", null)
}

exports.ResponseInternalServer = (res) => {
    return this.Response(res, 500, "internal server error", null)
}

exports.ResponseNotFound = (res) => {
    return this.Response(res, 404, "resource not found", null)
}

exports.ResponseGeneralError = (res, msg) => {
    return this.Response(res, 500, msg, null)
}

exports.ResponseRedirect = (res) => {
    return this.Response(res, 202, "redirect", null)
} 
