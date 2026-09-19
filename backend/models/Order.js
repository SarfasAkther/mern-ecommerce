const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                name: {
                    type: String,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        shippingAddress: {
            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            postalCode: {
                type: String,
                required: true
            },

            country: {
                type: String,
                required: true
            }
        },

        paymentMethod: {
            type: String,
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "processing"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;