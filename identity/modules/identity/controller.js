const UserService = require("./services/UserService");

exports.getUser = async (req, res) => {
    userId = req.params.id
    const config = {
        id: userId
    }
    const user = await UserService.getUser(config)

    if (!user)
        return res.status(400).json({
            code: 400,
            message: "false"
        })

    return res.status(200).json({
        user:user
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