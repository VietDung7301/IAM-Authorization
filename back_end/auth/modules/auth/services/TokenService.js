const { client } = require("../../../helpers/redis")

exports.savePublicKey = async (publicKey, client_id, user_id) => {
    try {
        const key = client_id + '@' + user_id + 'AccessToken'
        const content = {
            publicKey: publicKey
        }

        await client.set(key, JSON.stringify(content))
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.getPublicKey = async (client_id, user_id) => {
    try {
        const key = client_id + '@' + user_id + 'AccessToken'
        const value = await client.get(key)
        const content = JSON.parse(value)

        if (content == null)
            return false

            return content.publicKey
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.destroyAccessToken = async (client_id, user_id) => {
    try {
        const key = client_id + '@' + user_id + 'AccessToken'

        await client.del(key)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.destroyRefreshToken = async (client_id, user_id) => {
    try {
        const key = client_id + '@' + user_id + 'RefreshToken'

        await client.del(key)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.saveRefreshToken = async (refresh_token, client_id, user_id) => {
    try {
        const key = client_id + '@' + user_id + 'RefreshToken'
        const content = {
            token: refresh_token,
        }

        await client.set(key, JSON.stringify(content))
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.getRefreshToken = async (client_id, user_id) => {
    try {
        const key = client_id + '@' + user_id + 'RefreshToken'
        const value = await client.get(key)
        const content = JSON.parse(value)

        if (content == null)
            return false

        return content.token
    } catch (error) {
        console.log(error)
        return false
    }
}