exports.getAccount = async (config) => {
    try {
        const account = await DB_CONNECTION.models.LinkedAccount.findOne({where: config})
        return account
    } catch (error) {
        console.log(error)
        return null
    }
}