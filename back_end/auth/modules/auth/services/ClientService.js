exports.getClient = async (data) => {
    try {
        const client = await DB_CONNECTION.models.Client.findOne({ where: data })
        if (client == null) {
            return false
        }
        return client
    } catch (error) {
        console.log(error)
        return false
    }
    
}