// const mongoose = require("mongoose")
// const ProductRating = require("../models/productRating")
const { Sequelize } = require('sequelize');
const Client = require('../models/client')
require("dotenv").config();

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

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    /**
     * 2. Xóa dữ liệu cũ và khởi tạo dữ liệu mới
     */
    // systemDB.dropDatabase();
    console.log("@Setup new database")
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");

    //data
    

    // systemDB.close();
    console.log("\n\nDone. Initial database successfully.");
}

initDB().catch(error => {
    console.log(error);
    process.exit();
})