const jwt = require('jsonwebtoken')

const genToken = (claims) => {
    return jwt.sign(claims, 'id_token')
}

const genAccessToken = (claims, privateKey) => {
    return jwt.sign(claims, privateKey, { algorithm: 'RS256' })
}

module.exports = { genToken, genAccessToken }