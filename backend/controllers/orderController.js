
const Order = require("../models/Order");
const Product = require("../models/Product");


// Create Order - COD
const createOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        } = req.body;

        // Check stock before creating order
        for (const item of items) {
            const product = await Product.findById(
                item.product
            );

            if (!product) {
                return res.status(404).json({
                    message:
                        `Product not found: ${item.name}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message:
                        `${product.name} does not have enough stock. Available: ${product.stock}`
                });
            }
        }

        // Reduce stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        res.status(201).json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get My Orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        })
            .populate(
                "items.product",
                "name image"
            );

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get All Orders - Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate(
                "user",
                "name email"
            )
            .populate(
                "items.product",
                "name image"
            );

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update Order Status - Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order =
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    orderStatus: status
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found"
            });
        }

        res.json(order);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// Cancel My Order
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Make sure this order belongs to the logged-in user
        if (
            order.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Not authorized to cancel this order"
            });
        }

        // Only processing orders can be cancelled
        if (order.orderStatus !== "processing") {
            return res.status(400).json({
                message:
                    "Only processing orders can be cancelled"
            });
        }

        // Restore stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        // Change order status
        order.orderStatus = "cancelled";

        await order.save();

        res.json({
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};