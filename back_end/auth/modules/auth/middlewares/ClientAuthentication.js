const responseTrait = require('../../../traits/responseTrait')
const clientService = require('../services/ClientService')
const bcrypt = require('bcrypt')

exports.Handle = async (req, res, next) => {
    console.log('client authentication')
    const data = req.body
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
    try {
        const config = {
            id: client_id,
        }
        const client = await clientService.getClient(config)
        if (!await bcrypt.compare(client_secret, client.client_secret)) {
            return false
        }

        return client
    } catch (error) {
        console.log(error)
        return false
    }
}