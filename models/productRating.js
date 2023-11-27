const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductRatingSchema = new Schema({
    productId: {
        type: String
    },
    productName: {
        type: String
    },
    productImageUrl: {
        type: String
    },
    totalVote:{
        type: Number
    },
    avgStar:{
        type: Number
    },
    ratingList: [
        {
            orderId: {
                type: String
            },
            userId: {
                type: String
            },
            star: {
                type: Number
            },
            description: {
                type: String
            },
            userName:{
                type: String
            },
            handler: {
                type: String,
                default: null,
            },
            status: {
                type: Number,
                default: 1
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

module.exports = (db) => {
    if (!db.models.ProductRating) {
        return db.model('ProductRating', ProductRatingSchema)
    }
    return db.models.ProductRating
}