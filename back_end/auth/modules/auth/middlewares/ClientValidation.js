const clientService = require("../services/ClientService");
const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    const client = await clientService.getClient({id: data.client_id})
    if (!client) 
        return responseTrait.ResponseInvalid(res)
    
    const redirect_uri_arr = client.redirect_uri.split(',')
    if (!redirect_uri_arr.includes(data.redirect_uri))
        return responseTrait.ResponseInvalid(res)
    
    next()
}