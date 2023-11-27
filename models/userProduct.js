const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UserProductSchema =new Schema({
    userId:{
        type: String
    },
    userAccount:{
        type: String
    },
    userPassword:{
        type: String
    },
    userName:{
        type: String
    },
    userOrder:{
   type:[{
    orderId:{
        type: String
    },
    productId:{
        type: String
        },
    price:{
        type: Number
    }
    }]
}

}, {
    timestamps: true
});
module.exports = (db) => {
    if (!db.models.UserProduct) {
        return db.model('UserProduct', UserProductSchema)
    }
    return db.models.UserProduct
}