
const express = require("express");

const {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} = require("../controllers/wishlistController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get my wishlist
router.get(
    "/",
    protect,
    getWishlist
);

// Add product to wishlist
router.post(
    "/",
    protect,
    addToWishlist
);

// Remove product from wishlist
router.delete(
    "/:productId",
    protect,
    removeFromWishlist
);

module.exports = router;
