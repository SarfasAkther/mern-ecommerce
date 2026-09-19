
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
    const { id } = useParams();

    const { addToCart } = useCart();
    const { token, user } = useAuth();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce(
                      (sum, review) =>
                          sum + review.rating,
                      0
                  ) / reviews.length
              ).toFixed(1)
            : 0;

    useEffect(() => {
        getProduct();
        fetchReviews();
        fetchRelatedProducts();
    }, [id]);

    const getProduct = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/products/${id}`
            );

            const data = await response.json();

            setProduct(data);
        } catch (error) {
            console.log(
                "Error fetching product:",
                error
            );
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reviews/${id}`
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            setReviews(data);
        } catch (error) {
            console.log(
                "Reviews error:",
                error
            );
        }
    };

    const fetchRelatedProducts = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/products/${id}/related`
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            setRelatedProducts(data);
        } catch (error) {
            console.log(
                "Related products error:",
                error
            );
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            alert(
                "Please login to review this product"
            );
            return;
        }

        if (!comment.trim()) {
            alert("Please write a review");
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reviews`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            "Bearer " + token
                    },
                    body: JSON.stringify({
                        product: id,
                        rating: Number(rating),
                        comment: comment
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert(
                "Review added successfully"
            );

            setRating(5);
            setComment("");

            fetchReviews();
        } catch (error) {
            console.log(
                "Review error:",
                error
            );
        }
    };

    if (!product) {
        return (
            <h2
                style={{
                    textAlign: "center",
                    marginTop: "50px"
                }}
            >
                Loading...
            </h2>
        );
    }

    return (
        <div className="product-details-page">

            {/* Product Section */}

            <div className="product-details-main">

                {/* Product Image */}

                <div className="product-image-container">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-details-image"
                    />
                </div>

                {/* Product Information */}

                <div className="product-information">

                    <h1>
                        {product.name}
                    </h1>

                    <p className="product-rating">
                        ⭐ {averageRating}/5{" "}
                        ({reviews.length}{" "}
                        {reviews.length === 1
                            ? "review"
                            : "reviews"})
                    </p>

                    <p className="product-description">
                        {product.description}
                    </p>

                    <h2 className="product-price">
                        ₹{product.price}
                    </h2>

                    <p>
                        <strong>
                            Category:
                        </strong>{" "}
                        {product.category}
                    </p>

                    <p>
                        <strong>
                            Stock:
                        </strong>{" "}
                        {product.stock}
                    </p>

                    {product.stock > 0 ? (
                        <button
                            onClick={() =>
                                addToCart(product)
                            }
                            className="add-to-cart-button"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <button
                            disabled
                            className="add-to-cart-button"
                        >
                            Out of Stock
                        </button>
                    )}
                </div>
            </div>

            <hr className="section-divider" />

            {/* Review Form */}

            <div className="review-form-section">

                <h2>
                    Write a Review
                </h2>

                {user ? (
                    <form
                        onSubmit={submitReview}
                        className="review-form"
                    >
                        <label>
                            Rating:
                        </label>

                        <select
                            value={rating}
                            onChange={(e) =>
                                setRating(
                                    e.target.value
                                )
                            }
                            className="rating-select"
                        >
                            <option value="5">
                                5 - Excellent
                            </option>

                            <option value="4">
                                4 - Good
                            </option>

                            <option value="3">
                                3 - Average
                            </option>

                            <option value="2">
                                2 - Poor
                            </option>

                            <option value="1">
                                1 - Very Poor
                            </option>
                        </select>

                        <textarea
                            placeholder="Write your review"
                            value={comment}
                            onChange={(e) =>
                                setComment(
                                    e.target.value
                                )
                            }
                            rows="5"
                            className="review-textarea"
                        />

                        <button
                            type="submit"
                            className="submit-review-button"
                        >
                            Submit Review
                        </button>
                    </form>
                ) : (
                    <p>
                        Please login to write
                        a review.
                    </p>
                )}
            </div>

            <hr className="section-divider" />

            {/* Reviews */}

            <div className="reviews-section">

                <h2>
                    Customer Reviews
                </h2>

                {reviews.length === 0 ? (
                    <p>
                        No reviews yet.
                    </p>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review._id}
                            className="review-card"
                        >
                            <h3>
                                {
                                    review.user
                                        .name
                                }
                            </h3>

                            <p className="review-rating">
                                {"⭐".repeat(
                                    review.rating
                                )}

                                {"☆".repeat(
                                    5 -
                                        review.rating
                                )}{" "}
                                {review.rating}/5
                            </p>

                            <p>
                                {
                                    review.comment
                                }
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Related Products */}

            {relatedProducts.length > 0 && (
                <>
                    <hr className="section-divider" />

                    <div className="related-products-section">

                        <h2>
                            Related Products
                        </h2>

                        <div className="related-products-grid">

                            {relatedProducts.map(
                                (relatedProduct) => (
                                    <div
                                        key={
                                            relatedProduct._id
                                        }
                                        className="related-product-card"
                                        onClick={() =>
                                            (window.location.href =
                                                `/product/${relatedProduct._id}`)
                                        }
                                    >
                                        <img
                                            src={
                                                relatedProduct.image
                                            }
                                            alt={
                                                relatedProduct.name
                                            }
                                            className="related-product-image"
                                        />

                                        <h3>
                                            {
                                                relatedProduct.name
                                            }
                                        </h3>

                                        <p>
                                            ₹
                                            {
                                                relatedProduct.price
                                            }
                                        </p>

                                        <p>
                                            Category:{" "}
                                            {
                                                relatedProduct.category
                                            }
                                        </p>
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductDetails;