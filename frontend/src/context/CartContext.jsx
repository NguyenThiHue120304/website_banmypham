import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const addToCart = (product) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === product._id ? { ...x, qty: x.qty + 1 } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const increaseQty = (id) => {
        setCartItems(
            cartItems.map((x) =>
                x._id === id ? { ...x, qty: x.qty + 1 } : x
            )
        );
    };

    const decreaseQty = (id) => {
        setCartItems(
            cartItems.map((x) => {
                if (x._id === id) {
                    return { ...x, qty: x.qty > 1 ? x.qty - 1 : 1 };
                }
                return x;
            })
        );
    };

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);