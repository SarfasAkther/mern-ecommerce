const express = require("express");

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");

const {
    protect,
    admin
} = require("../middleware/authMiddleware");

const router = express.Router();


// Create order - logged in user
router.post(
    "/",
    protect,
    createOrder
);


// Get my orders - logged in user
router.get(
    "/my",
    protect,
    getMyOrders
);


// Get all orders - admin
router.get(
    "/",
    protect,
    admin,
    getAllOrders
);

router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);

router.put(
    "/:id/status",
    protect,
    admin,
    updateOrderStatus
);






module.exports = router;