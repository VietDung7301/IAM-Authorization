const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/sp07/product/rating',controller.privateGetAllProductRating);
router.get('/sp07/product/rating/:ratingId',controller.privateGetProductRating);
router.post('/product/rating',controller.createProductRating);
router.get('/product/rating',controller.getAllProductRating);
router.get('/product/user-rating',controller.getUserProductRating);
router.get('/product/rating/:id',controller.getProductRating);

router.patch('/processTransaction', controller.test);
module.exports = router;