
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminProducts() {
    const { token } = useAuth();

    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: ""
    });

    const [imageFile, setImageFile] = useState(null);

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        getProducts();
    }, []);

const getProducts = async () => {
    try {
        const response = await fetch(
            "http://localhost:3000/api/products"
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(data.message);
            return;
        }

        console.log("Products API response:", data);

        // If API returns an array
        if (Array.isArray(data)) {
            setProducts(data);
        }

        // If API returns { products: [...] }
        else if (Array.isArray(data.products)) {
            setProducts(data.products);
        }

        else {
            console.log(
                "Unexpected products response:",
                data
            );

            setProducts([]);
        }

    } catch (error) {
        console.log(
            "Get products error:",
            error
        );

        setProducts([]);
    }
};



    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const uploadImage = async () => {
        const formData = new FormData();

        formData.append("image", imageFile);

        try {
            const response = await fetch(
                "http://localhost:3000/api/products/upload",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return null;
            }

            return data.imageUrl;

        } catch (error) {
            console.log("Image upload error:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = form.image;

        // Upload new image if selected
        if (imageFile) {
            imageUrl = await uploadImage();

            if (!imageUrl) {
                return;
            }
        }

        if (!imageUrl) {
            alert("Please select an image");
            return;
        }

        const url = editingId
            ? `http://localhost:3000/api/products/${editingId}`
            : "http://localhost:3000/api/products";

        const method = editingId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: Number(form.price),
                    category: form.category,
                    stock: Number(form.stock),
                    image: imageUrl
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert(
                editingId
                    ? "Product updated"
                    : "Product created"
            );

            setForm({
                name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                image: ""
            });

            setImageFile(null);
            setEditingId(null);

            getProducts();

        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);

        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image
        });

        setImageFile(null);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/products/${id}`,
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

            alert("Product deleted");

            getProducts();

        } catch (error) {
            console.log(error);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);

        setImageFile(null);

        setForm({
            name: "",
            description: "",
            price: "",
            category: "",
            stock: "",
            image: ""
        });
    };

    return (
        <div>
            <h1>Admin Product Management</h1>

            <h2>
                {editingId
                    ? "Update Product"
                    : "Create Product"}
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="name"
                    placeholder="Product name"
                    value={form.name}
                    onChange={handleChange}
                />

                <br />

                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <br />

                <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                />

                <br />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                />

                <br />

                <input
                    name="stock"
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                />

                <br />

                <label>
                    Product Image:
                </label>

                <br />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setImageFile(e.target.files[0])
                    }
                />

                <br />

                {form.image && (
                    <img
                        src={form.image}
                        alt="Current product"
                        width="150"
                    />
                )}

                <br />

                <button type="submit">
                    {editingId
                        ? "Update Product"
                        : "Create Product"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <hr />

            <h2>Products</h2>

            {products.map((product) => (
                <div key={product._id}>

                    <img
                        src={product.image}
                        alt={product.name}
                        width="150"
                    />

                    <h3>{product.name}</h3>

                    <p>₹{product.price}</p>

                    <p>Stock: {product.stock}</p>

                    <button
                        onClick={() =>
                            handleEdit(product)
                        }
                    >
                        Edit
                    </button>

                    <button
                        onClick={() =>
                            handleDelete(product._id)
                        }
                    >
                        Delete
                    </button>

                    <hr />

                </div>
            ))}
        </div>
    );
}

export default AdminProducts;
