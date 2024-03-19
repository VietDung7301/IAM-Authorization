const axios = require('axios');
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')

const verifyAccessToken = async (access_token) => {
    const decoded = jwt_decode.jwtDecode(access_token)

    try {
        const {data} = await axios.get(`${process.env.AUTH_URL}/api/access_resource?user_id=${decoded.sub}&client_id=${decoded.client_id}`)
        return jwt.verify(access_token, data.public_key)
    } catch (error) {
        console.log(error)
        return false
    }   
}

const verifyScopes = async (url, method, scopes) => {
    try {
        const {data} = await axios.post(`${process.env.ROLE_URL}/api/permission/check`, {
            url: url,
            method: method,
            scopes: scopes,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return data.check
    } catch (error) {
        console.log(error)
        return false
    }
}

exports.accessResource = async (req, res) => {
    const authorization = req.get('Authorization')
    const data = req.body
    let token_content

    if (data.method == null ||
        data.url == null ||
        data.content_type == null)
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid request',
            }
        })

    // verify access token
    if (authorization != null) {
        let arr = authorization.split(" ")
        const access_token = arr[1];
        token_content = await verifyAccessToken(access_token)
        if (!token_content)
            return res.status(400).json({
                error: {
                    status: 400,
                    detail: 'unauthorized request',
                }
            })
    } else {
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid request',
            }
        })
    }

    // verify scopes
    if (!verifyScopes(data.url, data.method, token_content.scope))
        return res.status(400).json({
            error: {
                status: 400,
                detail: 'invalid scopes',
            }
        })
    
    try {
        const resource = await axios({
            url: data.url,
            method: data.method,
            headers: {
                'Content-Type': data.content_type
            }
        })
        
        return res.status(200).json({
            code: '200',
            resource_server_response: {
                data: resource.data
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            code: '500',
            resource_server_response: {
                    message: 'internal server error',
                    detail: 'internal server error'
            }
        })
    }
}

exports.test = async (req, res) => {
    const data = req.body
    const decoded = jwt_decode.jwtDecode(data.token)

    return res.status(200).json({
        user: decoded.sub,
        client: decoded.client_id
    })
}