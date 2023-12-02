const jwt = require('jsonwebtoken')

const genToken = (claims) => {
    return jwt.sign(claims, process.env.JWT_SECRET)
}

module.exports = { genToken }