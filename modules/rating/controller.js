const service = require("./service");

exports.createProductRating = async (req, res) => {
    try {
        const newProductRating = await service.createProductRating(req.body);
        res.status(201).json({
            success: true,
            messages: ["Add success"],
            content: newProductRating
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            messages: ["Add fail"],
            content: error.messages
        })
    }
}

exports.getAllProductRating = async (req, res) => {
    try {
        const allProductRating = await service.getAllProductRating();
      
        res.status(200).json({
            success: true,
            messages: ["Get success"],
            content: allProductRating
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            messages: ["Get fail"],
            content: error.messages
        })
    }
}




exports.getProductRating = async (req, res) => {
    try {
        const productRating = await service.getProductRating(req.params.id);

        res.status(200).json({
            success: true,
            messages: ["Get success"],
            content: productRating
        })
    } catch(err) {
        console.error(err);
        res.status(400).json({
            success: false,
            messages: ["Get fail"],
            content: err.messages
        })
    }
}

exports.getUserProductRating = async(req,res)=>{
    try {
        const result = await service.getUserProductRating(req.query);
        res.status(200).json({
            success: true,
            messages: [result.message],
            content: {rated:result.content}
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            messages: ["Get fail"],
            content: err.messages
        })
    }
}
exports.privateGetAllProductRating =async(req,res) => {
    try {
        const result = await service.privateGetAllProductRating ();
        res.status(200).json({
            success: true,
            messages: ["Get Success"],
            content: result
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            messages: ["Get fail"],
            content: err.messages
        })
    }

}
exports.privateGetProductRating =async(req,res) => {
    try {
        const result = await service.privateGetProductRating (req.params.ratingId);
        res.status(200).json({
            success: true,
            messages: ["Get Success"],
            content: result
        })
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            messages: ["Get fail"],
            content: err.messages
        })
    }

}

exports.test = async(req, res) => {
    res.status(200).json({
        errorCode: "00",
        transaction: {
            cardCode: "12398471209834",
            owner: "Viet Dung",
            command: "pay",
            cvvCode: "123",
            dateExpired: "1020",
            transactionId: "AWOIFJ2098209134",
            transactionContent: "Oke con te te luon",
            amount: "100000",
            createdAt: "2020-11-4 10:55:26"
        }
    })
}