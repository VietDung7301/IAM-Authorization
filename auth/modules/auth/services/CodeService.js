const { client } = require("../../../helpers/redis")

exports.saveAuthCode = async (code, client_id, user_id, exp) => {
    const key = user_id + '@' + client_id + 'code'
    const content = {
        code: code,
        exp: exp,
    }

    await client.set(key, JSON.stringify(content))
    await client.expire(key, parseInt(exp))
}

exports.getAuthCode = async (client_id, user_id) => {
    const key = user_id + '@' + client_id + 'code'
    const value = await client.get(key)
    const content = JSON.parse(value)

    if (content == null)
        return false

    return content.code
}

exports.removeAuthCode = async (client_id, user_id) => {
    const key = user_id + '@' + client_id + 'code'
    return await client.del(key)
}