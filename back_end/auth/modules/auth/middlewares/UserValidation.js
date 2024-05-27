const axios = require('axios');
const responseTrait = require('../../../traits/responseTrait')

exports.Handle = async (req, res, next) => {
    console.log('user validation')
    const data = req.body

    if (!data.username ||!data.password)
        return responseTrait.Response(res, 401, "unauthorized user!", null)

    const user_id = await UserValidation(data.username, data.password)
    if (!user_id)
        return responseTrait.Response(res, 401, "unauthorized user!", null)

    req.body.user_id = user_id
    next()

}

const UserValidation = async (username, password) => {
    // call to identity module and validate user
    try {
        const {data} = await axios.post(`${process.env.IDEN_URL}/api/iden/user/authen`, {
            username: username,
            password: password,
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