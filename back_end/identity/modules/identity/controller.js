const UserService = require("./services/UserService");
const randomStr = require("randomstring")

exports.getAll = async (req, res) => {

}

exports.getUser = async (req, res) => {
    const id = req.params.id
    const user = await UserService.getUser(id)

    if (!user)
        return res.status(400).json({
            code: 400,
            message: "user not exist!"
        })

    return res.status(200).json({
        user:user
    })
}

exports.createUser = async (req, res) => {
    const data = req.body
    // validation

    data.id = randomStr.generate(10)
    const user = await UserService.createUser(data)
    if (!user)
        return res.status(400).json({
            code: 400,
            message: "false"
        })
    
    return res.status(200).json({
        user:user
    })
}

exports.updateUser = async (req, res) => {
    const id = req.params.id
    const data = req.body
    // validate

    const result = await UserService.updateUser(id, data)
    if (!result)
        return res.status(400).json({
            code: 400,
            message: "false"
        })
    
    return res.status(200).json({
        result:result
    })
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id

    const result = await UserService.deleteUser(id)
    if (!result)
        return res.status(400).json({
            code: 400,
            message: "false"
        })

    return res.status(200).json({
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
        return res.status(401).json({
            code: 401,
            message: "invalid credentials" 
        })

    return res.status(200).json({
        user: user
    })
}

exports.test = async (req, res) => {
    console.log(DB_CONNECTION.models)

    return res.status(200).json({
        "message":"tách module iden thành công"
    })
}