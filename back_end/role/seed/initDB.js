const { Sequelize } = require('sequelize');
const { models } = require('../models')
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
    await sequelize.models.Role.bulkCreate([
        {
            id: '123',
            title: 'test role',
            active: 1,
            Scopes: [
                {
                    id: '123',
                    title: 'scope1',
                    active: 1,
                },
            ]
        },
    ],
    {
        include: sequelize.models.Scope,
    })
    await sequelize.models.Permission.bulkCreate([
        {
            id: '123',
            title: 'test permission',
            active: 1,
            accessible_url: 'www.google.com',
            method: 'GET',
            ScopeId: '123',
        },
    ])

    // systemDB.close();
    console.log("\n\nDone. Initial database successfully.");
}

initDB().catch(error => {
    console.log(error);
    process.exit();
})