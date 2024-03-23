exports.getUser = async (data) => {
    const user = await DB_CONNECTION.models.User.findOne({where: data})
    if (user == null) {
        return false
    }
    return user
}