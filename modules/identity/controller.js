const service = require("./service");

exports.AuthenUser = async (data) => {
    return await service.getUser(data)
}