import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

// CartContext holds the global cart state
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);   // Array of cart item objects
  const [cartLoading, setCartLoading] = useState(false);

  // Helper to extract items from varied backend response structures
  const extractItems = (data) => {
    return data?.cart?.items || data?.data?.items || data?.items || [];
  };

  // ── Derived Values ──────────────────────────────────────────────
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.price ?? item.book?.price ?? 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  // ── Fetch Cart from Backend ─────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      setCartLoading(true);
      const res = await api.get('/cart');
      setCartItems(extractItems(res.data));
    } catch (err) {
      console.error('Cart fetch error:', err?.response?.data?.message || err.message);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart whenever auth state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ── Add to Cart ─────────────────────────────────────────────────
  const addToCart = async (bookId, quantity = 1, format = 'paperback', price, setExactQuantity = false) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please sign in to add items to cart.' };
    }
    try {
      const res = await api.post('/cart', { bookId, quantity, format, price, setExactQuantity });
      setCartItems(extractItems(res.data));
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || err?.response?.data?.message || 'Failed to add to cart.' };
    }
  };

  // ── Remove Item from Cart ───────────────────────────────────────
  const removeFromCart = async (bookId) => {
    try {
      const res = await api.delete(`/cart/${bookId}`);
      setCartItems(extractItems(res.data));
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || err?.response?.data?.message || 'Failed to remove item.' };
    }
  };

  // ── Clear Entire Cart ───────────────────────────────────────────
  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || 'Failed to clear cart.' };
    }
  };

  // ── Check if a book is in cart ──────────────────────────────────
  const isInCart = (bookId) =>
    cartItems.some((item) => (item.book?._id || item.book) === bookId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartLoading,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
