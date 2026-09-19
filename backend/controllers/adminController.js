
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAnalytics = async (req, res) => {
    try {
        // Total users
        const totalUsers = await User.countDocuments();

        // Total products
        const totalProducts = await Product.countDocuments();

        // Total orders
        const totalOrders = await Order.countDocuments();

        // Total revenue
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: {
                        $ne: "cancelled"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);

        // Monthly sales
        const monthlySales = await Order.aggregate([
            {
                $match: {
                    orderStatus: {
                        $ne: "cancelled"
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    revenue: {
                        $sum: "$totalAmount"
                    },
                    orders: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        // Send analytics response
        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            ordersByStatus,
            monthlySales
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get analytics",
            error: error.message
        });
    }
};


// Low stock products
const getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            stock: {
                $lte: 5
            }
        }).sort({
            stock: 1
        });

        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get low stock products",
            error: error.message
        });
    }
};


module.exports = {
    getAnalytics,
    getLowStockProducts
};
