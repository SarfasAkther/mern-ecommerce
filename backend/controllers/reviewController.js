const Review = require("../models/Review");

const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;

        const existingReview = await Review.findOne({
            product,
            user: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this product"
            });
        }

        const review = await Review.create({
            product,
            user: req.user._id,
            rating,
            comment
        });

        res.status(201).json(review);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId
        })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json(reviews);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createReview,
    getProductReviews
};