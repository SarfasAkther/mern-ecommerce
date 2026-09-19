
import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");

        return savedCart
            ? JSON.parse(savedCart)
            : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );
    }, [cart]);

    const addToCart = (product) => {
        console.log("Adding product:", product);

        setCart((currentCart) => {
            const existingProduct =
                currentCart.find(
                    (item) =>
                        item._id === product._id
                );

            if (existingProduct) {

                // Don't exceed stock
                if (
                    existingProduct.quantity >=
                    product.stock
                ) {
                    alert(
                        "Cannot add more. Stock limit reached."
                    );

                    return currentCart;
                }

                return currentCart.map((item) =>
                    item._id === product._id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1
                          }
                        : item
                );
            }

            // Product is out of stock
            if (product.stock <= 0) {
                alert("Product is out of stock.");

                return currentCart;
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    const removeFromCart = (productId) => {
        setCart((currentCart) =>
            currentCart.filter(
                (item) =>
                    item._id !== productId
            )
        );
    };

    const increaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item._id !== productId) {
                    return item;
                }

                // Don't exceed stock
                if (
                    item.quantity >=
                    item.stock
                ) {
                    alert(
                        "Cannot add more. Stock limit reached."
                    );

                    return item;
                }

                return {
                    ...item,
                    quantity:
                        item.quantity + 1
                };
            })
        );
    };

    const decreaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item._id === productId
                        ? {
                              ...item,
                              quantity:
                                  item.quantity - 1
                          }
                        : item
                )
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}