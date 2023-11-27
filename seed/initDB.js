const mongoose = require("mongoose")
const ProductRating = require("../models/productRating")
require("dotenv").config();

const initDB = async () => {
    console.log("Starting init database. Please wait...\n");

    /**
     * 1. Tạo kết nối đến database
     */
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

    const systemDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/${process.env.DB_NAME}`,
        connectOptions
    );

    if (!systemDB) throw ("ERROR: Cannot connect to database");

    /**
     * 2. Xóa dữ liệu cũ và khởi tạo dữ liệu mới
     */
    systemDB.dropDatabase();
    console.log("@Setup new database")
    
    await ProductRating(systemDB).insertMany([
        {
            productId: "day la product",
            avgStar: 5,
            totalVote: 0
        }
    ])

    systemDB.close();
    console.log("\n\nDone. Initial database successfully.");
}

initDB().catch(error => {
    console.log(error);
    process.exit();
})