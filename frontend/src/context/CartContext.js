import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'CUSTOMER') {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user?.id]);

  const fetchCart = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/cart/${user.id}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      const res = await axiosInstance.post(`/cart/${user.id}`, {
        productId: product.id,
        quantity,
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error('Failed to add to cart', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axiosInstance.delete(`/cart/${user.id}/${productId}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error('Failed to remove from cart', err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return removeFromCart(productId);
    try {
      const res = await axiosInstance.put(`/cart/${user.id}/${productId}?quantity=${newQuantity}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete(`/cart/clear/${user.id}`);
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.priceAtPurchase * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};