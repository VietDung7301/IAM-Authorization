const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    const authorization = req.get('Authorization')

    if (authorization != null) {
        let arr = authorization.split(" ")
        const secret = arr[1];
        const client = await ClientValidation(data.client_id, secret)

        if (!client) {
            return responseTrait.ResponseUnauthenticate(res)
        }
    } else {
        return responseTrait.ResponseUnauthenticate(res)
    }

    next()
}

const ClientValidation = async (client_id, client_secret) => {
    // authenticate client
    // const hash = Crypto.SHA256(client_secret)
    // const hashed_secret = hash.toString(Crypto.enc.Hex)

    const config = {
        id: client_id,
        client_secret: client_secret
    }

    const client = await clientService.getClient(config)
    
    return client
}