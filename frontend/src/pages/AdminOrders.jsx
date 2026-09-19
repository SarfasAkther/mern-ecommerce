
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminOrders() {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/orders",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setOrders(data);

        } catch (error) {
            console.log(
                "Admin orders error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (
        orderId,
        newStatus
    ) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/orders/${orderId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Order status updated");

            getOrders();

        } catch (error) {
            console.log(
                "Update status error:",
                error
            );
        }
    };

    if (loading) {
        return <h2>Loading orders...</h2>;
    }

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1>Admin Orders</h1>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order._id}
                        style={{
                            border:
                                "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "20px",
                            marginBottom: "20px"
                        }}
                    >
                        <h2>
                            Order #
                            {order._id.slice(-6)}
                        </h2>

                        <p>
                            <strong>
                                Customer:
                            </strong>{" "}
                            {order.user?.name}
                        </p>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {order.user?.email}
                        </p>

                        <p>
                            <strong>
                                Total:
                            </strong>{" "}
                            ₹{order.totalAmount}
                        </p>

                        <p>
                            <strong>
                                Payment:
                            </strong>{" "}
                            {order.paymentMethod}
                        </p>

                        <p>
                            <strong>
                                Payment Status:
                            </strong>{" "}
                            {order.paymentStatus}
                        </p>

                        <p>
                            <strong>
                                Current Status:
                            </strong>{" "}
                            {order.orderStatus}
                        </p>

                        <h3>
                            Shipping Address
                        </h3>

                        <p>
                            {order.shippingAddress.address}
                            <br />
                            {
                                order.shippingAddress
                                    .city
                            }
                            <br />
                            {
                                order.shippingAddress
                                    .postalCode
                            }
                            <br />
                            {
                                order.shippingAddress
                                    .country
                            }
                        </p>

                        <h3>Products</h3>

                        {order.items.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding:
                                            "10px 0",
                                        borderBottom:
                                            "1px solid #eee"
                                    }}
                                >
                                    <strong>
                                        {item.name}
                                    </strong>

                                    <p>
                                        Quantity:{" "}
                                        {
                                            item.quantity
                                        }
                                    </p>

                                    <p>
                                        Price: ₹
                                        {item.price}
                                    </p>
                                </div>
                            )
                        )}

                        <div
                            style={{
                                marginTop: "20px"
                            }}
                        >
                            <label>
                                <strong>
                                    Update Status:
                                </strong>
                            </label>

                            <select
                                value={
                                    order.orderStatus
                                }
                                onChange={(e) =>
                                    updateStatus(
                                        order._id,
                                        e.target.value
                                    )
                                }
                                style={{
                                    marginLeft:
                                        "10px",
                                    padding:
                                        "8px"
                                }}
                            >
                                <option value="processing">
                                    Processing
                                </option>

                                <option value="shipped">
                                    Shipped
                                </option>

                                <option value="delivered">
                                    Delivered
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>
                            </select>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default AdminOrders;

