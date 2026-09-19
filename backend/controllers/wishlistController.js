
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Get My Wishlist
const getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({
            user: req.user._id
        }).populate(
            "products",
            "name price image category stock"
        );

        // If user doesn't have a wishlist yet
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: []
            });
        }

        res.json(wishlist);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Add Product to Wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Find user's wishlist
        let wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        // Create wishlist if it doesn't exist
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: []
            });
        }

        // Check if already exists
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({
                message: "Product already in wishlist"
            });
        }

        // Add product
        wishlist.products.push(productId);

        await wishlist.save();

        // Return updated wishlist
        wishlist = await wishlist.populate(
            "products",
            "name price image category stock"
        );

        res.status(201).json(wishlist);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Remove Product from Wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }

        wishlist.products =
            wishlist.products.filter(
                (id) =>
                    id.toString() !== productId
            );

        await wishlist.save();

        const updatedWishlist =
            await wishlist.populate(
                "products",
                "name price image category stock"
            );

        res.json(updatedWishlist);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};
