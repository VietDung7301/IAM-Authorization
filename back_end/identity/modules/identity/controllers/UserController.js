const UserService = require("../services/UserService")
const randomStr = require("randomstring")
const responseTrait = require('../../../traits/responseTrait')
const bcrypt = require('bcrypt')

exports.getAll = async (req, res) => {
    return responseTrait.ResponseSuccess(res, {
        users: await UserService.getAll()
    })
}

exports.getUser = async (req, res) => {
    const id = req.params.id
    const query = req.query
    const config = {
        id: id
    }
    const user = await UserService.getUser(config)

    if (!user)
        return responseTrait.ResponseNotFound(res)

    if (query.claims) {
        let claims = query.claims.split(',')
        for (const [key, value] of Object.entries(user.dataValues)) {
            if (!claims.includes(key)) {
                delete user.dataValues[key]
            }
        }
    }

    if (user.dataValues.password) delete user.dataValues.password
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
    const config = {
        id: id
    }
    const data = req.body
    // validate

    const result = await UserService.updateUser(config, data)
    if (!result)
        return responseTrait.ResponseInternalServer(res)
    
    return responseTrait.ResponseSuccess(res, {
        result:result
    })
}

exports.deleteUser = async (req, res) => {
    const id = req.params.id
    const config = {
        id: id
    }

    const result = await UserService.deleteUser(config)
    if (!result)
        return responseTrait.ResponseInternalServer(res)

    return responseTrait.ResponseSuccess(res, {
        deleted_user:result
    })
}

exports.authenticateUser = async (req, res) => {
    try {
        const data = req.body
        const config = {
            username: data.username,
        }
        const user = await UserService.getUser(config)
        if (!user) {
            return responseTrait.ResponseNotFound(res)
        }
        if (!await bcrypt.compare(data.password, user.password))
            return responseTrait.ResponseNotFound(res)

        delete user.dataValues.password
        return responseTrait.ResponseSuccess(res, {
            user:user.dataValues
        })
    } catch (error) {
        console.log(error)
        return responseTrait.ResponseNotFound(res)
    }
}