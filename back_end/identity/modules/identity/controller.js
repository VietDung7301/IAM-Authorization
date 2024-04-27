const UserService = require("./services/UserService");
const randomStr = require("randomstring")
const responseTrait = require('../../traits/responseTrait')

exports.getAll = async (req, res) => {
    return responseTrait.ResponseSuccess(res, {
        users: await UserService.getAll()
    })
}

exports.getUser = async (req, res) => {
    const id = req.params.id
    const user = await UserService.getUser(id)

    if (!user)
        return responseTrait.ResponseNotFound(res)

    return responseTrait.ResponseSuccess(res, {
        user:user
    })
}

exports.createUser = async (req, res) => {
    const data = req.body
    // validation

    data.id = randomStr.generate(10)
    const user = await UserService.createUser(data)
    if (!user)
        return responseTrait.ResponseInternalServer(res)
    
    return responseTrait.ResponseSuccess(res, {
        user:user
    })
}

exports.updateUser = async (req, res) => {
    const id = req.params.id
    const data = req.body
    // validate

    const result = await UserService.updateUser(id, data)
    if (!result)
        return responseTrait.ResponseInternalServer(res)
    
    return responseTrait.ResponseSuccess(res, {
        result:result
    })
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id

    const result = await UserService.deleteUser(id)
    if (!result)
        return responseTrait.ResponseInternalServer(res)

    return responseTrait.ResponseSuccess(res, {
        deleted_user:result
    })
}

exports.authenticateUser = async (req, res) => {
    const data = req.body
    const config = {
        username: data.username,
        password: data.password,
    }
    const user = await UserService.getUser(config)

    if (!user)
        return responseTrait.ResponseNotFound(res)

    return responseTrait.ResponseSuccess(res, {
        user:user
    })
}

exports.getFingerprint = async (req, res) => {
    const id = req.params.id

    const result = await UserService.getFingerprints(id)

    return res.status(200).json({
        fingerprints: result
    })
}

exports.test = async (req, res) => {
    console.log(DB_CONNECTION.models)

    return res.status(200).json({
        "message":"tách module iden thành công"
    })
}