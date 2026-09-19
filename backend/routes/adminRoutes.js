
const express = require("express");

const {
    getAnalytics,
    getLowStockProducts
} = require("../controllers/adminController");

const {
    protect,
    admin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/analytics",
    protect,
    admin,
    getAnalytics
);

router.get(
    "/low-stock",
    protect,
    admin,
    getLowStockProducts
);

module.exports = router;
