
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [sort, setSort] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 8;

    useEffect(() => {
        getProducts();
    }, [page]);

    const getProducts = async () => {
        try {
            const params = new URLSearchParams();

            if (search) {
                params.append("search", search);
            }

            if (category) {
                params.append("category", category);
            }

            if (minPrice) {
                params.append("minPrice", minPrice);
            }

            if (maxPrice) {
                params.append("maxPrice", maxPrice);
            }

            if (sort) {
                params.append("sort", sort);
            }

            params.append("page", page);
            params.append("limit", limit);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/products?${params.toString()}`
            );

            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                return;
            }

            setProducts(data.products);
            setTotalPages(data.totalPages);

        } catch (error) {
            console.log(
                "Error fetching products:",
                error
            );
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();

        setPage(1);
        getProducts();
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        setPage(1);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(1);
    };

    const handleApplyPrice = (e) => {
        e.preventDefault();

        setPage(1);
        getProducts();
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setPage(1);
    };

    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px"
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    margin: "30px 0"
                }}
            >
                Products
            </h1>

            {/* Search */}
            <form
                onSubmit={handleSearch}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "20px",
                    flexWrap: "wrap"
                }}
            >
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        width: "300px"
                    }}
                />

                <button type="submit">
                    Search
                </button>
            </form>

            {/* Filters */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "30px",
                    flexWrap: "wrap"
                }}
            >
                {/* Category */}
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    style={{
                        padding: "10px"
                    }}
                >
                    <option value="">
                        All Categories
                    </option>

                    <option value="Shirt">
                        Shirt
                    </option>

                    <option value="Shoes">
                        Shoes
                    </option>
                </select>

                {/* Minimum Price */}
                <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) =>
                        setMinPrice(e.target.value)
                    }
                    style={{
                        width: "110px",
                        padding: "10px"
                    }}
                />

                {/* Maximum Price */}
                <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) =>
                        setMaxPrice(e.target.value)
                    }
                    style={{
                        width: "110px",
                        padding: "10px"
                    }}
                />

                <button onClick={handleApplyPrice}>
                    Apply Price
                </button>

                {/* Sort */}
                <select
                    value={sort}
                    onChange={handleSortChange}
                    style={{
                        padding: "10px"
                    }}
                >
                    <option value="">
                        Sort By
                    </option>

                    <option value="priceAsc">
                        Price: Low → High
                    </option>

                    <option value="priceDesc">
                        Price: High → Low
                    </option>

                    <option value="newest">
                        Newest
                    </option>
                </select>

                {/* Clear */}
                <button onClick={clearFilters}>
                    Clear Filters
                </button>
            </div>

            {/* Products */}
            {products.length === 0 ? (
                <p
                    style={{
                        textAlign: "center"
                    }}
                >
                    No products found.
                </p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "15px",
                        marginTop: "40px"
                    }}
                >
                    <button
                        disabled={page === 1}
                        onClick={() =>
                            setPage(page - 1)
                        }
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() =>
                            setPage(page + 1)
                        }
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Products;
