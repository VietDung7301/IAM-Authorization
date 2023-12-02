/**
 * File này khởi tạo các biến global, có thể được sử dụng trong toàn bộ chương trình
 */

const { Sequelize } = require('sequelize');
const { models } = require('./models')


const initModels = (db, models) => {
    console.log('init model')
    for (const [key, value] of Object.entries(models)) {
        db.define(value.modelConfig.name, value.modelConfig.attributes)
    }
    console.log('finish init')
    // console.log(db.models);
}

module.exports = async(server) => {
    let connectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        db: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
    }

    global.DB_CONNECTION = new Sequelize(connectOptions.db, connectOptions.user, connectOptions.pass, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    })

    //const client1 = Client.build({client_secret: '123', redirect_uri: '123', client_type: '123'})
    initModels(DB_CONNECTION, models);
}