exports.getAll = async () => {
    return await DB_CONNECTION.models.User.findAll()
}

exports.getUser = async (id) => {
    try {
        const user = await DB_CONNECTION.models.User.findOne({where: {id:id}})
        if (user == null) {
            return false
        }
        return user
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.createUser = async (data) => {
    try {
        const user = await DB_CONNECTION.models.User.create(data)
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

exports.updateUser = async (id, data) => {
    try {
        const user = await DB_CONNECTION.models.User.findOne({where: {id:id}})
        if (user == null) {
            return false
        }
        return await user.update(data)
    } catch (error) {
        console.log(error)
        return null
    }
}

exports.deleteUser = async (id) => {
    try {
        const user = await DB_CONNECTION.models.User.findOne({where: {id:id}})
        if (user == null) {
            return false
        }
        return await user.destroy()
    } catch (error) {
        console.log(error)
        return false
    }
}