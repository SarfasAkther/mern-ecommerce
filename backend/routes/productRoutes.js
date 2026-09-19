
const express = require("express");

const {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    getRelatedProducts
} = require("../controllers/productController");

const {
    protect,
    admin
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public routes

router.get("/", getProducts);

router.get(
    "/:id/related",
    getRelatedProducts
);

router.get("/:id", getProductById);


// Admin routes

router.post(
    "/upload",
    protect,
    admin,
    upload.single("image"),
    uploadProductImage
);

router.post(
    "/",
    protect,
    admin,
    createProduct
);

router.put(
    "/:id",
    protect,
    admin,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteProduct
);

module.exports = router;