
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Checkout() {

    const {
        cart,
        setCart
    } = useCart();

    const {
        token,
        user
    } = useAuth();

    const navigate = useNavigate();

    const [address, setAddress] =
        useState("");

    const [city, setCity] =
        useState("");

    const [postalCode, setPostalCode] =
        useState("");

    const [country, setCountry] =
        useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("COD");

    const [loading, setLoading] =
        useState(false);


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    // Create normal COD order

    const placeCODOrder = async () => {

        const response = await fetch(
            "http://localhost:3000/api/orders",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({

                    items: cart.map(
                        (item) => ({
                            product:
                                item._id,

                            name:
                                item.name,

                            price:
                                item.price,

                            quantity:
                                item.quantity
                        })
                    ),

                    totalAmount: total,

                    shippingAddress: {
                        address,
                        city,
                        postalCode,
                        country
                    },

                    paymentMethod: "COD"
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to place order"
            );
        }


        return data;
    };


    // Razorpay payment

    const payWithRazorpay = async () => {

        // Step 1: Create Razorpay order

        const response = await fetch(
            "http://localhost:3000/api/payment/create-order",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    amount: total
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to create payment"
            );
        }


        // Step 2: Load Razorpay

        const options = {

            key:
                "rzp_test_TdBlBl9AHgSiKR",

            amount:
                data.amount,

            currency:
                data.currency,

            name:
                "My E-Commerce Store",

            description:
                "Order Payment",

            order_id:
                data.id,


            handler: async function (
                paymentResponse
            ) {

                try {

                    // Step 3: Verify payment

                    const verifyResponse =
                        await fetch(
                            "http://localhost:3000/api/payment/verify",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    Authorization:
                                        `Bearer ${token}`
                                },

                                body:
                                    JSON.stringify({

                                        razorpay_order_id:
                                            paymentResponse.razorpay_order_id,

                                        razorpay_payment_id:
                                            paymentResponse.razorpay_payment_id,

                                        razorpay_signature:
                                            paymentResponse.razorpay_signature,

                                        items:
                                            cart.map(
                                                (item) => ({
                                                    product:
                                                        item._id,

                                                    name:
                                                        item.name,

                                                    price:
                                                        item.price,

                                                    quantity:
                                                        item.quantity
                                                })
                                            ),

                                        totalAmount:
                                            total,

                                        shippingAddress: {
                                            address,
                                            city,
                                            postalCode,
                                            country
                                        }
                                    })
                            }
                        );


                    const verifyData =
                        await verifyResponse.json();


                    if (!verifyResponse.ok) {
                        alert(
                            verifyData.message ||
                            "Payment verification failed"
                        );

                        return;
                    }


                    // Payment successful

                    alert(
                        "Payment successful! Order placed."
                    );


                    setCart([]);

                    navigate("/orders");


                } catch (error) {

                    console.error(
                        "Verification error:",
                        error
                    );

                    alert(
                        "Payment verification failed"
                    );
                }
            },


            prefill: {
                name:
                    user?.name || "",

                email:
                    user?.email || ""
            },


            theme: {
                color: "#3399cc"
            }
        };


        if (!window.Razorpay) {
            throw new Error(
                "Razorpay SDK not loaded"
            );
        }


        const razorpay =
            new window.Razorpay(options);


        razorpay.on(
            "payment.failed",
            function (response) {

                console.log(
                    "Razorpay payment failed:",
                    response
                );

                alert(
                    response.error?.description ||
                    "Payment failed"
                );
            }
        );


        razorpay.open();
    };


    // Submit checkout

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (cart.length === 0) {
            alert(
                "Your cart is empty"
            );

            return;
        }


        try {

            setLoading(true);


            if (
                paymentMethod ===
                "COD"
            ) {

                await placeCODOrder();

                alert(
                    "Order placed successfully"
                );

                setCart([]);

                navigate("/orders");

            } else {

                await payWithRazorpay();

            }

        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );

            alert(
                error.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="checkout-page">

            <h1>
                Checkout
            </h1>


            {/* Order Total */}

            <div className="checkout-total">

                <h2>
                    Order Total: ₹{total}
                </h2>

            </div>


            <h2>
                Shipping Address
            </h2>


            <form
                onSubmit={handleSubmit}
                className="checkout-form"
            >

                <input
                    type="text"
                    placeholder="Full Address"
                    value={address}
                    onChange={(e) =>
                        setAddress(
                            e.target.value
                        )
                    }
                    required
                />


                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) =>
                        setCity(
                            e.target.value
                        )
                    }
                    required
                />


                <input
                    type="text"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) =>
                        setPostalCode(
                            e.target.value
                        )
                    }
                    required
                />


                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) =>
                        setCountry(
                            e.target.value
                        )
                    }
                    required
                />


                <h2>
                    Payment Method
                </h2>


                <div className="payment-methods">

                    <label>

                        <input
                            type="radio"
                            value="COD"
                            checked={
                                paymentMethod ===
                                "COD"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        {" "}
                        Cash on Delivery

                    </label>


                    <label>

                        <input
                            type="radio"
                            value="RAZORPAY"
                            checked={
                                paymentMethod ===
                                "RAZORPAY"
                            }
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        />

                        {" "}
                        Pay Online with Razorpay

                    </label>

                </div>


                <button
                    type="submit"
                    disabled={loading}
                    className="checkout-button"
                >

                    {loading
                        ? "Processing..."
                        : paymentMethod ===
                          "COD"
                            ? "Place Order"
                            : "Pay ₹" + total}

                </button>

            </form>

        </div>
    );
}

export default Checkout;
