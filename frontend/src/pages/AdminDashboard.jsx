
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
    const { token } = useAuth();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            getDashboardData();
        }
    }, [token]);

    const getDashboardData = async () => {
        try {
            // Get products
            const productsResponse = await fetch(
                "http://localhost:3000/api/products"
            );

            const productsData =
                await productsResponse.json();

            // Get orders
            const ordersResponse = await fetch(
                "http://localhost:3000/api/orders",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const ordersData =
                await ordersResponse.json();

            // Get analytics
            const analyticsResponse = await fetch(
                "http://localhost:3000/api/admin/analytics",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const analyticsData =
                await analyticsResponse.json();

            // Get low-stock products
            const lowStockResponse = await fetch(
                "http://localhost:3000/api/admin/low-stock",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const lowStockData =
                await lowStockResponse.json();

            if (
                !productsResponse.ok ||
                !ordersResponse.ok ||
                !analyticsResponse.ok ||
                !lowStockResponse.ok
            ) {
                console.log(
                    "Dashboard data error"
                );
                return;
            }

            const productList =
                Array.isArray(productsData)
                    ? productsData
                    : productsData.products || [];

            setProducts(productList);

            setOrders(
                Array.isArray(ordersData)
                    ? ordersData
                    : []
            );

            setAnalytics(analyticsData);

            setLowStockProducts(
                Array.isArray(lowStockData)
                    ? lowStockData
                    : []
            );

        } catch (error) {
            console.log(
                "Dashboard error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    padding: "40px"
                }}
            >
                <h2>
                    Loading dashboard...
                </h2>
            </div>
        );
    }

    const getStatusCount = (status) => {
        const statusData =
            analytics?.ordersByStatus?.find(
                (item) =>
                    item._id === status
            );

        return statusData
            ? statusData.count
            : 0;
    };

    const processingOrders =
        getStatusCount("processing");

    const shippedOrders =
        getStatusCount("shipped");

    const deliveredOrders =
        getStatusCount("delivered");

    const cancelledOrders =
        getStatusCount("cancelled");

    const monthlySales =
        analytics?.monthlySales || [];

    const getMonthName = (monthNumber) => {
        const date = new Date(
            2026,
            monthNumber - 1,
            1
        );

        return date.toLocaleString(
            "default",
            {
                month: "short"
            }
        );
    };

    const maxRevenue =
        monthlySales.length > 0
            ? Math.max(
                  ...monthlySales.map(
                      (item) =>
                          item.revenue
                  )
              )
            : 0;

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1>
                Admin Dashboard
            </h1>

            <p>
                Welcome to your store
                management dashboard.
            </p>

            {/* Statistics */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <div
                    style={{
                        border:
                            "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>
                        Total Users
                    </h3>

                    <h2>
                        {analytics?.totalUsers || 0}
                    </h2>
                </div>

                <div
                    style={{
                        border:
                            "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>
                        Total Products
                    </h3>

                    <h2>
                        {analytics?.totalProducts || 0}
                    </h2>
                </div>

                <div
                    style={{
                        border:
                            "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>
                        Total Orders
                    </h3>

                    <h2>
                        {analytics?.totalOrders || 0}
                    </h2>
                </div>

                <div
                    style={{
                        border:
                            "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>
                        Total Revenue
                    </h3>

                    <h2>
                        ₹
                        {analytics?.totalRevenue || 0}
                    </h2>
                </div>

            </div>

            {/* Order Status */}

            <div
                style={{
                    marginTop: "40px"
                }}
            >
                <h2>
                    Order Overview
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, 1fr)",
                        gap: "15px",
                        marginTop: "20px"
                    }}
                >

                    <div
                        style={{
                            border:
                                "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px"
                        }}
                    >
                        <h3>
                            Processing
                        </h3>

                        <h2>
                            {processingOrders}
                        </h2>
                    </div>

                    <div
                        style={{
                            border:
                                "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px"
                        }}
                    >
                        <h3>
                            Shipped
                        </h3>

                        <h2>
                            {shippedOrders}
                        </h2>
                    </div>

                    <div
                        style={{
                            border:
                                "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px"
                        }}
                    >
                        <h3>
                            Delivered
                        </h3>

                        <h2>
                            {deliveredOrders}
                        </h2>
                    </div>

                    <div
                        style={{
                            border:
                                "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px"
                        }}
                    >
                        <h3>
                            Cancelled
                        </h3>

                        <h2>
                            {cancelledOrders}
                        </h2>
                    </div>

                </div>
            </div>

            {/* Monthly Sales */}

            <div
                style={{
                    marginTop: "40px",
                    border:
                        "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "25px"
                }}
            >
                <h2>
                    Monthly Sales
                </h2>

                {monthlySales.length === 0 ? (
                    <p>
                        No sales data available.
                    </p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: "25px",
                            height: "300px",
                            marginTop: "30px",
                            overflowX: "auto",
                            paddingBottom: "20px"
                        }}
                    >
                        {monthlySales.map(
                            (item) => {

                                const barHeight =
                                    maxRevenue > 0
                                        ? (item.revenue /
                                              maxRevenue) *
                                          220
                                        : 0;

                                return (
                                    <div
                                        key={`${item._id.year}-${item._id.month}`}
                                        style={{
                                            minWidth:
                                                "70px",
                                            height:
                                                "250px",
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            justifyContent:
                                                "flex-end",
                                            alignItems:
                                                "center"
                                        }}
                                    >

                                        <strong
                                            style={{
                                                marginBottom:
                                                    "5px"
                                            }}
                                        >
                                            ₹
                                            {item.revenue}
                                        </strong>

                                        <div
                                            style={{
                                                width:
                                                    "45px",
                                                height:
                                                    `${barHeight}px`,
                                                background:
                                                    "#333",
                                                borderRadius:
                                                    "6px 6px 0 0"
                                            }}
                                        />

                                        <span
                                            style={{
                                                marginTop:
                                                    "10px"
                                            }}
                                        >
                                            {
                                                getMonthName(
                                                    item._id
                                                        .month
                                                )
                                            }{" "}
                                            {
                                                item._id
                                                    .year
                                            }
                                        </span>

                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>

            {/* Low Stock Alerts */}

            <div
                style={{
                    marginTop: "40px",
                    border:
                        "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "25px"
                }}
            >
                <h2>
                    ⚠️ Low Stock Alerts
                </h2>

                {lowStockProducts.length === 0 ? (
                    <p>
                        All products have
                        sufficient stock.
                    </p>
                ) : (
                    lowStockProducts.map(
                        (product) => (
                            <div
                                key={product._id}
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    borderBottom:
                                        "1px solid #eee",
                                    padding:
                                        "15px 0"
                                }}
                            >
                                <div>
                                    <strong>
                                        {
                                            product.name
                                        }
                                    </strong>

                                    <p
                                        style={{
                                            margin:
                                                "5px 0 0"
                                        }}
                                    >
                                        ₹
                                        {
                                            product.price
                                        }
                                    </p>
                                </div>

                                <strong>
                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : `${product.stock} left`}
                                </strong>
                            </div>
                        )
                    )
                )}
            </div>

            {/* Recent Orders */}

            <div
                style={{
                    marginTop: "40px"
                }}
            >
                <h2>
                    Recent Orders
                </h2>

                {orders.length === 0 ? (
                    <p>
                        No orders yet.
                    </p>
                ) : (
                    orders
                        .slice(0, 5)
                        .map((order) => (
                            <div
                                key={order._id}
                                style={{
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "10px",
                                    padding:
                                        "15px",
                                    marginBottom:
                                        "10px"
                                }}
                            >
                                <strong>
                                    Order #
                                    {order._id.slice(
                                        -6
                                    )}
                                </strong>

                                <p>
                                    Customer:{" "}
                                    {
                                        order.user
                                            ?.name
                                    }
                                </p>

                                <p>
                                    Total: ₹
                                    {
                                        order.totalAmount
                                    }
                                </p>

                                <p>
                                    Payment:{" "}
                                    {
                                        order.paymentStatus
                                    }
                                </p>

                                <p>
                                    Status:{" "}
                                    {
                                        order.orderStatus
                                    }
                                </p>
                            </div>
                        ))
                )}
            </div>

        </div>
    );
}

export default AdminDashboard;
