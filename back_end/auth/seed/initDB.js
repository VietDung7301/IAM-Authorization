const { Sequelize, QueryInterface } = require('sequelize');
const { models } = require('../models')
const bcrypt = require('bcrypt')
require("dotenv").config();

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
                    console.log('1')
                    db.models[value.modelConfig.name]?.hasOne(db.models[association.target], association?.options)
                }
                else if (association.relation == 'hasMany') {
                    console.log('2')
                    db.models[value.modelConfig.name]?.hasMany(db.models[association.target], association?.options)
                }
                else if (association.relation == 'belongsTo') {
                    console.log('3')
                    db.models[value.modelConfig.name]?.belongsTo(db.models[association.target], association?.options)
                }
                else if (association.relation == 'belongsToMany') {
                    console.log('4')
                    db.models[value.modelConfig.name]?.belongsToMany(db.models[association.target], association?.options)
                }
            })
        }
    }
    console.log('finish init')
}

const initDB = async () => {
    console.log("Starting init database. Please wait...\n");

    /**
     * 1. Tạo kết nối đến database
     */
    let connectOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            db: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
        }

    const sequelize = new Sequelize(connectOptions.db, connectOptions.user, connectOptions.pass, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql'
    })

    

    /**
     * Xóa dữ liệu cũ và khởi tạo dữ liệu mới
     */
    initModels(sequelize, models)

    console.log("@Setup new database")
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    //data
    console.log('insert data')
    await sequelize.models.Client.bulkCreate([
        {
            id: '4321',
            client_secret: await bcrypt.hash('4321', parseInt(process.env.SALT_ROUND)),
            redirect_uri: 'http://localhost:3001/login/callback',
            client_type: 1,
            name: 'demo client 1',
            homepage_url: 'http://localhost:3001',
        },
        {
            id: '1234',
            client_secret: await bcrypt.hash('1234', parseInt(process.env.SALT_ROUND)),
            redirect_uri: 'https://iam-demo-1.vercel.app/login/callback',
            client_type: 1,
            name: 'client 1',
            homepage_url: 'https://iam-demo-1.vercel.app',
        }
    ])

    // systemDB.close();
    console.log("\n\nDone. Initial database successfully.");
}

initDB().catch(error => {
    console.log(error);
    process.exit();
})