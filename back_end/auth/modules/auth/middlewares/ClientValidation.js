const clientService = require("../services/ClientService");

exports.Handle = async (req, res, next) => {
    const client = await clientService.getClient({id: data.client_id})
    if (!client) 
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'unknown client'
            }
        })
    
    const redirect_uri_arr = client.redirect_uri.split(',')
    if (!redirect_uri_arr.includes(data.redirect_uri))
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid redirect uri'
            }
        })
    
    next()
}