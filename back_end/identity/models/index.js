const models = {
    User: require('./user'),
    Fingerprint: require('./fingerprint'),
    Otp: require('./otp'),
    LinkedAccount: require('./linked_account')
}

module.exports = { 
    models
}