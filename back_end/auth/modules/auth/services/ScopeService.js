const axios = require('axios')
const userService = require('./UserService')

exports.getScope = async (user_id, scopes) => {
    // gọi role module để lấy scope
    const user = await userService.getUser(user_id)
    if (!user)
        return ""
    
    if (!scopes)
        return ""
    
    try {
        const {data} = await axios.get(`${process.env.ROLE_URL}/api/get-scopes-from-role/${user.role_id}`)
        const req_scopes = scopes.split(' ')

        let valid_scopes = ''

        for (const req_scope of req_scopes) {
            if (data.data.scopes.includes(req_scope))
                valid_scopes = valid_scopes + req_scope + ' '
        }

        return valid_scopes.trim()
    } catch (error) {
        console.log(error)
        return ""
    }
}