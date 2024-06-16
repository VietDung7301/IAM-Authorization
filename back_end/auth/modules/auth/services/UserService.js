const axios = require('axios')

exports.getUser = async (user_id) => {
    try {
        const {data} = await axios.get(`${process.env.IDEN_URL}/api/iden/user/${user_id}`)
        return data.data.user
    } catch (error) {
        console.log(error)
        return false
    }
}