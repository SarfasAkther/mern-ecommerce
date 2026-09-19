
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Orders() {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
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
            console.log("Orders error:", error);
        }
    };

    // Cancel Order
    const cancelOrder = async (orderId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Order cancelled successfully");

            getOrders();

        } catch (error) {
            console.log("Cancel order error:", error);
        }
    };

    // Tracking steps
    const trackingSteps = [
        "processing",
        "shipped",
        "delivered"
    ];

    // Get current tracking position
    const getStatusIndex = (status) => {
        return trackingSteps.indexOf(status);
    };

    return (
        <div className="orders-page">

            <h1>My Orders</h1>

            {orders.length === 0 ? (

                <div className="no-orders">
                    <h2>No Orders Yet</h2>

                    <p>
                        Your orders will appear here after
                        you place an order.
                    </p>
                </div>

            ) : (

                orders.map((order) => {

                    const currentStatus =
                        getStatusIndex(order.orderStatus);

                    return (

                        <div
                            key={order._id}
                            className="order-card"
                        >

                            {/* Order Header */}

                            <div className="order-header">

                                <div>
                                    <h2>Order Details</h2>

                                    <p className="order-id">
                                        Order ID: {order._id}
                                    </p>
                                </div>

                                <span
                                    className={`order-status ${order.orderStatus}`}
                                >
                                    {order.orderStatus}
                                </span>

                            </div>


                            <hr />


                            {/* Order Information */}

                            <div className="order-info">

                                <div>
                                    <strong>Order Total</strong>
                                    <p>
                                        ₹{order.totalAmount}
                                    </p>
                                </div>

                                <div>
                                    <strong>Payment Method</strong>
                                    <p className="uppercase">
                                        {order.paymentMethod}
                                    </p>
                                </div>

                                <div>
                                    <strong>Payment Status</strong>
                                    <p
                                        className={
                                            order.paymentStatus === "paid"
                                                ? "payment-paid"
                                                : "payment-pending"
                                        }
                                    >
                                        {order.paymentStatus}
                                    </p>
                                </div>

                                <div>
                                    <strong>Order Date</strong>
                                    <p>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                            </div>


                            {/* Cancel Order */}

                            {order.orderStatus === "processing" && (

                                <div className="cancel-container">

                                    <button
                                        className="cancel-button"
                                        onClick={() =>
                                            cancelOrder(order._id)
                                        }
                                    >
                                        Cancel Order
                                    </button>

                                </div>

                            )}


                            {/* Tracking */}

                            <h3 className="section-title">
                                Order Tracking
                            </h3>

                            {order.orderStatus === "cancelled" ? (

                                <div className="cancelled-message">
                                    <strong>
                                        Order Cancelled
                                    </strong>
                                </div>

                            ) : (

                                <div className="tracking-container">

                                    {/* Connecting line */}

                                    <div className="tracking-line"></div>

                                    {trackingSteps.map(
                                        (step, index) => {

                                            const completed =
                                                index <= currentStatus;

                                            return (

                                                <div
                                                    key={step}
                                                    className="tracking-step"
                                                >

                                                    <div
                                                        className={`tracking-circle ${
                                                            completed
                                                                ? "completed"
                                                                : ""
                                                        }`}
                                                    >
                                                        {completed
                                                            ? "✓"
                                                            : index + 1}
                                                    </div>

                                                    <strong>
                                                        {step}
                                                    </strong>

                                                </div>

                                            );
                                        }
                                    )}

                                </div>
                            )}


                            {/* Shipping Address */}

                            <h3 className="section-title">
                                Shipping Address
                            </h3>

                            <div className="shipping-address">

                                <p>
                                    {
                                        order.shippingAddress
                                            .address
                                    }
                                </p>

                                <p>
                                    {
                                        order.shippingAddress
                                            .city
                                    }
                                    ,{" "}
                                    {
                                        order.shippingAddress
                                            .postalCode
                                    }
                                </p>

                                <p>
                                    {
                                        order.shippingAddress
                                            .country
                                    }
                                </p>

                            </div>


                            {/* Products */}

                            <h3 className="section-title">
                                Ordered Products
                            </h3>

                            {order.items.map(
                                (item, index) => (

                                    <div
                                        key={
                                            item.product?._id ||
                                            item.product ||
                                            index
                                        }
                                        className="ordered-product"
                                    >

                                        {/* Product Image */}

                                        {item.product?.image && (

                                            <img
                                                src={
                                                    item.product
                                                        .image
                                                }
                                                alt={item.name}
                                                className="ordered-product-image"
                                            />

                                        )}


                                        <div className="ordered-product-info">

                                            <strong>
                                                {item.name}
                                            </strong>

                                            <p>
                                                ₹{item.price} ×{" "}
                                                {item.quantity}
                                            </p>

                                        </div>

                                        <strong className="ordered-product-total">
                                            ₹
                                            {
                                                item.price *
                                                item.quantity
                                            }
                                        </strong>

                                    </div>

                                )
                            )}


                            {/* Total */}

                            <div className="order-final-total">

                                <h2>
                                    Total: ₹
                                    {order.totalAmount}
                                </h2>

                            </div>

                        </div>
                    );
                })
            )}

        </div>
    );
}

export default Orders;
