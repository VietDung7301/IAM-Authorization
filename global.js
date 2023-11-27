/**
 * File này khởi tạo các biến global, có thể được sử dụng trong toàn bộ chương trình
 */

const mongoose = require("mongoose");
const models = require('./models')


const initModels = (db, models) => {
    for (const [key, model] of Object.entries(models)) {
        if (!db.models[key]) model(db)
    }
}

module.exports = async(server) => {
    let connectOptions = process.env.DB_AUTHENTICATION === 'true' ?
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
            auth: {
                authSource: 'admin'
            }
        } : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    global.DB_CONNECTION = mongoose.createConnection(process.env.MONGO_URL?
        process.env.MONGO_URL:
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/${process.env.DB_NAME}`
    );

    initModels(DB_CONNECTION, models);
}