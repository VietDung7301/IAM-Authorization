const UserService = require("./services/UserService");

exports.getUser = async (req, res) => {
    userId = req.params.id
    const config = {
        id: userId
    }
    const user = await UserService.getUser(config)

    if (!user)
        return res.status(400).json({
            "msg": "false, no user"
        })

    return res.status(200).json({
        "user":user
    })
}

exports.test = async (req, res) => {
    console.log(DB_CONNECTION.models)

    return res.status(200).json({
        "message":"tách module iden thành công"
    })
}