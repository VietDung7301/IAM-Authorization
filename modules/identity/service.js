exports.getUser = async (data) => {
    return await DB_CONNECTION.models.User.findOne({ where: data })
}