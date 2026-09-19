
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");
const Product = require("../models/Product");


// Create Razorpay Payment Order
const createPaymentOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                message:
                    "Invalid payment amount"
            });
        }

        const options = {
            amount:
                Math.round(amount * 100),

            currency: "INR",

            receipt:
                `receipt_${Date.now()}`
        };

        const order =
            await razorpay.orders.create(
                options
            );

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error(
            "Razorpay order error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


// Verify Razorpay Payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            totalAmount,
            shippingAddress
        } = req.body;


        // -------------------------
        // Verify Razorpay signature
        // -------------------------

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env
                        .RAZORPAY_KEY_SECRET
                )
                .update(
                    razorpay_order_id +
                    "|" +
                    razorpay_payment_id
                )
                .digest("hex");


        if (
            generatedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                message:
                    "Payment verification failed"
            });
        }


        // -------------------------
        // Check product stock
        // -------------------------

        for (const item of items) {
            const product =
                await Product.findById(
                    item.product
                );

            if (!product) {
                return res.status(404).json({
                    message:
                        `Product not found: ${item.name}`
                });
            }

            if (
                product.stock <
                item.quantity
            ) {
                return res.status(400).json({
                    message:
                        `${product.name} does not have enough stock. Available: ${product.stock}`
                });
            }
        }


        // -------------------------
        // Reduce product stock
        // -------------------------

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


        // -------------------------
        // Create paid order
        // -------------------------

        const order =
            await Order.create({
                user: req.user._id,

                items,

                totalAmount,

                shippingAddress,

                paymentMethod:
                    "RAZORPAY",

                paymentStatus:
                    "paid"
            });


        res.status(201).json({
            message:
                "Payment successful",

            order
        });

    } catch (error) {
        console.error(
            "Payment verification error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createPaymentOrder,
    verifyPayment
};
