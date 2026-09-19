
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
    const { token } = useAuth();

    const [isWishlisted, setIsWishlisted] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    // Check if product is already in wishlist
    const checkWishlist = async () => {
        if (!token) {
            setIsWishlisted(false);
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return;
            }

            const exists = data.products?.some(
                (item) => item._id === product._id
            );

            setIsWishlisted(exists);
        } catch (error) {
            console.log(
                "Check wishlist error:",
                error
            );
        }
    };

    useEffect(() => {
        checkWishlist();
    }, [token, product._id]);

    // Toggle wishlist
    const toggleWishlist = async () => {
        if (!token) {
            alert(
                "Please login to use wishlist."
            );
            return;
        }

        if (loading) return;

        setLoading(true);

        try {
            let response;

            if (isWishlisted) {
                // Remove from wishlist
                response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/wishlist/${product._id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );
            } else {
                // Add to wishlist
                response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/wishlist`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            productId:
                                product._id
                        })
                    }
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setIsWishlisted(
                !isWishlisted
            );
        } catch (error) {
            console.log(
                "Wishlist error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-card">

            {/* Product Image */}
            <div className="product-image-container">

                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />

                {/* Wishlist Button */}
                <button
                    className="wishlist-button"
                    onClick={toggleWishlist}
                    disabled={loading}
                    aria-label={
                        isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    {isWishlisted
                        ? "💔"
                        : "❤️"}
                </button>

            </div>

            {/* Product Information */}
            <div className="product-info">

                <h3 className="product-name">
                    {product.name}
                </h3>

                <p className="product-price">
                    ₹{product.price}
                </p>

                <p className="product-category">
                    {product.category}
                </p>

                <p
                    className={
                        product.stock > 0
                            ? "product-stock in-stock"
                            : "product-stock out-of-stock"
                    }
                >
                    {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                </p>

                {/* Actions */}
                <div className="product-actions">

                    <Link
                        to={`/product/${product._id}`}
                        className="view-product-button"
                    >
                        View Product
                    </Link>

                    <button
                        className="wishlist-text-button"
                        onClick={toggleWishlist}
                        disabled={loading}
                    >
                        {loading
                            ? "..."
                            : isWishlisted
                            ? "Remove Wishlist"
                            : "Add to Wishlist"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ProductCard;
