import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity, umkmId) => {
        setCart(prevCart => {
            // Pastikan keranjang hanya berisi produk dari 1 UMKM yang sama
            if (prevCart.length > 0 && prevCart[0].umkm !== umkmId) {
                alert("Anda hanya bisa memesan dari 1 UMKM yang sama dalam 1 transaksi. Selesaikan atau kosongkan keranjang Anda.");
                return prevCart;
            }

            const existingItem = prevCart.find(item => item.product === product._id);
            if (existingItem) {
                return prevCart.map(item => 
                    item.product === product._id 
                    ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * product.price }
                    : item
                );
            }

            return [...prevCart, {
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                subtotal: product.price * quantity,
                umkm: umkmId
            }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product !== productId));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => cart.reduce((total, item) => total + item.subtotal, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
