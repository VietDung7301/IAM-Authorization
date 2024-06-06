const axios = require('axios');
const responseTrait = require('../../../traits/responseTrait')
const { jwtDecode } = require('jwt-decode');

exports.Handle = async (req, res, next) => {
    console.log('linked account validation')
    const data = req.body

    if (!data.credential)
        return responseTrait.Response(res, 401, "unauthorized user!", null)

    const user_id = await LinkedAccountValidation(data.credential)
    if (!user_id)
        return responseTrait.Response(res, 401, "unauthorized user!", null)

    req.body.user_id = user_id
    next()

}

const LinkedAccountValidation = async (credential) => {
    // call to identity module and validate user
    try {
        const decodedToken = jwtDecode(credential)
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/user/authen/linked_account`, {
            iss: decodedToken.iss,
            sub: decodedToken.sub
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data.data.user.id
    } catch (error) {
        console.log(error)
        return false
    }
}