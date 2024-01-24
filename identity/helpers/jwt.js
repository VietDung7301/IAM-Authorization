const jwt = require('jsonwebtoken')

const genToken = (claims) => {
    return jwt.sign(claims, process.env.JWT_SECRET)
}

// hàm này đang lỗi do openssl 3.0 không tương thích ???
const genAccessToken = (claims, privateKey) => {
    return jwt.sign(claims, privateKey, { algorithm: 'RS256' })
}

module.exports = { genToken, genAccessToken }