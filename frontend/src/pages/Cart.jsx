
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity
    } = useCart();

    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <h1>Your Cart is Empty</h1>

                <p>
                    Add some products to your cart
                    to continue shopping.
                </p>

                <Link to="/">
                    <button className="continue-shopping-button">
                        Continue Shopping
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">

            <h1>Shopping Cart</h1>

            {/* Cart Items */}

            <div className="cart-items">

                {cart.map((item) => (
                    <div
                        key={item._id}
                        className="cart-item"
                    >
                        {/* Product Image */}

                        <img
                            src={item.image}
                            alt={item.name}
                            className="cart-item-image"
                        />

                        {/* Product Information */}

                        <div className="cart-item-info">

                            <h2>
                                {item.name}
                            </h2>

                            <p>
                                Price: ₹{item.price}
                            </p>

                            <p>
                                Subtotal: ₹
                                {item.price *
                                    item.quantity}
                            </p>

                            {/* Quantity Controls */}

                            <div className="quantity-controls">

                                <button
                                    onClick={() =>
                                        decreaseQuantity(
                                            item._id
                                        )
                                    }
                                >
                                    −
                                </button>

                                <span>
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        increaseQuantity(
                                            item._id
                                        )
                                    }
                                    disabled={
                                        item.quantity >=
                                        item.stock
                                    }
                                >
                                    +
                                </button>

                            </div>

                            {/* Remove */}

                            <button
                                onClick={() =>
                                    removeFromCart(
                                        item._id
                                    )
                                }
                                className="remove-button"
                            >
                                Remove
                            </button>

                        </div>
                    </div>
                ))}

            </div>

            {/* Cart Summary */}

            <div className="cart-summary">

                <h2>
                    Total: ₹{total}
                </h2>

                <div className="cart-actions">

                    <Link to="/">
                        <button>
                            Continue Shopping
                        </button>
                    </Link>

                    <Link to="/checkout">
                        <button>
                            Proceed to Checkout
                        </button>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Cart;
