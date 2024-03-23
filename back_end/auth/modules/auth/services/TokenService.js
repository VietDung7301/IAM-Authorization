const { client } = require("../../../helpers/redis")

exports.savePublicKey = async (publicKey, client_id, user_id) => {
    const key = client_id + '@' + user_id + 'AccessToken'
    const content = {
        publicKey: publicKey
    }

    await client.set(key, JSON.stringify(content))
}

exports.getPublicKey = async (client_id, user_id) => {
    const key = client_id + '@' + user_id + 'AccessToken'
    const value = await client.get(key)
    const content = JSON.parse(value)

    if (content == null)
        return false

        return content.publicKey
}

exports.destroyAccessToken = async (client_id, user_id) => {
    const key = client_id + '@' + user_id + 'AccessToken'
    await client.del(key)
}

exports.saveRefreshToken = async (refresh_token, client_id, user_id) => {
    const key = client_id + '@' + user_id + 'RefreshToken'
    const content = {
        token: refresh_token,
    }

    await client.set(key, JSON.stringify(content))
}

exports.getRefreshToken = async (client_id, user_id) => {
    const key = client_id + '@' + user_id + 'RefreshToken'
    const value = await client.get(key)
    const content = JSON.parse(value)

    if (content == null)
        return false

    return content.token
}