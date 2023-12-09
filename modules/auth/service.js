exports.createClient = async (data) => {
    await DB_CONNECTION.models.Client.create(data)
}

exports.updateClient = async (data) => {
    // const update = await DB_CONNECTION.models.Client.create(data)
    // await update.save()
}

exports.getClient = async (data) => {
    const client = await DB_CONNECTION.models.Client.findOne({ where: data })
    if (client == null)
        return false
    
    return client
}