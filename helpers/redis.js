const { createClient } = require('redis');
const client = createClient({
    url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', err => console.log('Redis Client Error', err));
client.connect();

const saveAuthCode = async (code, client_id, user_id, exp) => {
    const key = user_id + '@' + client_id + 'code'
    const content = {
        code: code,
        exp: exp,
    }

    await client.set(key, JSON.stringify(content))
    await client.expire(key, parseInt(exp))
}

const getAuthCode = async (client_id, user_id) => {
    const key = user_id + '@' + client_id + 'code'
    const value = await client.get(key)
    const content = JSON.parse(value)

    if (content == null)
        return false

    return content.code
}

const saveAccessToken = async (access_token, expires_in, client_id, user_id) => {
    const key = client_id + '@' + user_id + 'AccessToken'
    const content = {
        token: access_token,
        expires_in: expires_in
    }

    await client.set(key, JSON.stringify(content))
    await client.expire(key, parseInt(expires_in))
}

const saveRefreshToken = async (refresh_token, client_id, user_id) => {
    const key = client_id + '@' + user_id + 'RefreshToken'
    const content = {
        token: refresh_token,
    }

    await client.set(key, JSON.stringify(content))
}

module.exports = { saveAuthCode, getAuthCode, saveAccessToken, saveRefreshToken }