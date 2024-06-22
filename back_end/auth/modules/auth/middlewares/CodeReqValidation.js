const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    console.log('requirement validation')
    const data = req.body

    if (!data.response_type || data.response_type == '' || 
        !data.client_id || data.client_id == '' || 
        !data.redirect_uri || data.redirect_uri == '')
        return responseTrait.ResponseInvalid(res)

    if (data.response_type != 'code')
        return responseTrait.ResponseInvalid(res)

    next()
}