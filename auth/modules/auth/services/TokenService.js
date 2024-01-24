const { client } = require("../../../helpers/redis")

exports.saveAccessToken = async (access_token, publicKey, expires_in, client_id, user_id) => {
    const key = client_id + '@' + user_id + 'AccessToken'
    const content = {
        token: access_token,    //bỏ
        publicKey: publicKey,
        expires_in: expires_in,
    }

    await client.set(key, JSON.stringify(content))
    await client.expire(key, parseInt(expires_in))
}

exports.getAccessToken = async (client_id, user_id) => {        // bỏ
    const key = client_id + '@' + user_id + 'AccessToken'
    const value = await client.get(key)
    const content = JSON.parse(value)

    if (content == null)
        return false

    return content.token
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