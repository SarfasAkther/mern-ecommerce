
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { cart } = useCart();
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav
            style={{
                padding: "15px 30px",
                borderBottom: "1px solid #ddd",
                marginBottom: "20px",
                background: "grey"
            }}
        >
            {/* Top navbar */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center"
                }}
            >
                {/* Logo */}

                <Link
                    to="/"
                    style={{
                        fontSize: "20px",
                        fontWeight: "bold"
                    }}
                >
                    MyStore
                </Link>

                {/* Desktop navigation */}

                <div
                    className="desktop-nav"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginLeft: "30px"
                    }}
                >
                    <Link to="/">
                        Products
                    </Link>

                    <Link to="/cart">
                        Cart ({cartCount})
                    </Link>

                    {user && (
                        <>
                            <Link to="/orders">
                                Orders
                            </Link>

                            <Link to="/wishlist">
                                Wishlist ❤️
                            </Link>

                            <Link to="/profile">
                                Profile
                            </Link>
                        </>
                    )}

                    {user && user.role === "admin" && (
                        <>
                            <Link to="/admin">
                                Admin Dashboard
                            </Link>

                            <Link to="/admin/products">
                                Admin Products
                            </Link>

                            <Link to="/admin/orders">
                                Admin Orders
                            </Link>
                        </>
                    )}
                </div>

                {/* Desktop right side */}

                <div
                    className="desktop-nav"
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}
                >
                    {user ? (
                        <>
                            <span>
                                Hello, {user.name}
                            </span>

                            <button onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}

                <button
                    className="mobile-menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        marginLeft: "auto",
                        fontSize: "24px",
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    ☰
                </button>
            </div>

            {/* Mobile navigation */}

            {menuOpen && (
                <div
                    className="mobile-nav"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                        marginTop: "20px"
                    }}
                >
                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        Products
                    </Link>

                    <Link
                        to="/cart"
                        onClick={closeMenu}
                    >
                        Cart ({cartCount})
                    </Link>

                    {user && (
                        <>
                            <Link
                                to="/orders"
                                onClick={closeMenu}
                            >
                                Orders
                            </Link>

                            <Link
                                to="/wishlist"
                                onClick={closeMenu}
                            >
                                Wishlist ❤️
                            </Link>

                            <Link
                                to="/profile"
                                onClick={closeMenu}
                            >
                                Profile
                            </Link>
                        </>
                    )}

                    {user && user.role === "admin" && (
                        <>
                            <Link
                                to="/admin"
                                onClick={closeMenu}
                            >
                                Admin Dashboard
                            </Link>

                            <Link
                                to="/admin/products"
                                onClick={closeMenu}
                            >
                                Admin Products
                            </Link>

                            <Link
                                to="/admin/orders"
                                onClick={closeMenu}
                            >
                                Admin Orders
                            </Link>
                        </>
                    )}

                    {user ? (
                        <>
                            <span>
                                Hello, {user.name}
                            </span>

                            <button
                                onClick={() => {
                                    logout();
                                    closeMenu();
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
