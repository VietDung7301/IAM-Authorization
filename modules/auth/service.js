exports.createClient = async (data) => {
    await DB_CONNECTION.models.Client.create(data)
}

exports.updateClient = async (data) => {
    // const update = await DB_CONNECTION.models.Client.create(data)
    // await update.save()
}