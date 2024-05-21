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
    console.log('init relationships')
    for (const [key, value] of Object.entries(models)) {
        if (value.modelConfig.associations != undefined) {
            value.modelConfig.associations.forEach((association) => {
                if (association.relation == 'hasOne') {
                    db.models[value.modelConfig.name]?.hasOne(db.models[association.target], association?.options)
                }
                else if (association.relation == 'hasMany') {
                    db.models[value.modelConfig.name]?.hasMany(db.models[association.target], association?.options)
                }
                else if (association.relation == 'belongsTo') {
                    db.models[value.modelConfig.name]?.belongsTo(db.models[association.target], association?.options)
                }
                else if (association.relation == 'belongsToMany') {
                    db.models[value.modelConfig.name]?.belongsToMany(db.models[association.target], association?.options)
                }
            })
        }
    }
    console.log('finish init model')
}

module.exports = async (server) => {
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
        dialect: 'mysql',
    })

    try {
        await DB_CONNECTION.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    initModels(DB_CONNECTION, models)
    //console.log(await DB_CONNECTION.models['Client'].findAll())
    console.log("Synching models")
    await DB_CONNECTION.sync();
    console.log("All models were synchronized successfully.");
}