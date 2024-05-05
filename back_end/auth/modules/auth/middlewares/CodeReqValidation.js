const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    const data = req.body

    if (data.response_type == null || 
        data.client_id == null ||
        data.redirect_uri == null)
        return responseTrait.ResponseInvalid(res)

    if (data.response_type != 'code')
        return responseTrait.ResponseInvalid(res)

    next()
}