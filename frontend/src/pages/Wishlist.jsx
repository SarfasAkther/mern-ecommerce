
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
    const { token } = useAuth();
    const { addToCart } = useCart();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get wishlist
    const getWishlist = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/api/wishlist",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            setWishlist(data.products || []);

        } catch (error) {
            console.log(
                "Get wishlist error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getWishlist();
        }
    }, [token]);


    // Remove from wishlist
    const removeFromWishlist = async (productId) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/wishlist/${productId}`,
                {
                    method: "DELETE",
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

            setWishlist(data.products || []);

        } catch (error) {
            console.log(
                "Remove wishlist error:",
                error
            );
        }
    };


    // Add wishlist product to cart
    const handleAddToCart = (product) => {
        if (product.stock <= 0) {
            alert("Product is out of stock.");
            return;
        }

        addToCart(product);

        alert("Product added to cart");
    };


    if (loading) {
        return (
            <h2 className="wishlist-loading">
                Loading wishlist...
            </h2>
        );
    }


    return (
        <div className="wishlist-page">

            <h1>My Wishlist ❤️</h1>

            {wishlist.length === 0 ? (

                <div className="empty-wishlist">

                    <p>
                        Your wishlist is empty.
                    </p>

                    <Link to="/">
                        Continue Shopping
                    </Link>

                </div>

            ) : (

                <div className="wishlist-grid">

                    {wishlist.map((product) => (

                        <div
                            key={product._id}
                            className="wishlist-card"
                        >

                            <img
                                src={product.image}
                                alt={product.name}
                                className="wishlist-image"
                            />

                            <h3>
                                {product.name}
                            </h3>

                            <p className="wishlist-price">
                                ₹{product.price}
                            </p>

                            <p>
                                Category:{" "}
                                {product.category}
                            </p>

                            <p
                                className={
                                    product.stock > 0
                                        ? "stock-available"
                                        : "stock-out"
                                }
                            >
                                {product.stock > 0
                                    ? `Stock: ${product.stock}`
                                    : "Out of stock"}
                            </p>

                            <div className="wishlist-actions">

                                <Link
                                    to={`/product/${product._id}`}
                                    className="wishlist-view"
                                >
                                    View Product
                                </Link>

                                <button
                                    onClick={() =>
                                        handleAddToCart(
                                            product
                                        )
                                    }
                                    disabled={
                                        product.stock <= 0
                                    }
                                >
                                    Add to Cart
                                </button>

                                <button
                                    onClick={() =>
                                        removeFromWishlist(
                                            product._id
                                        )
                                    }
                                >
                                    Remove ❤️
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Wishlist;