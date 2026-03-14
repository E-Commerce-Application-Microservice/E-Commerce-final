import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCart, removeFromCart, clearCart } from '../api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });

  const fetchCart = async () => {
    if (!user) { setCart({ items: [], total: 0, count: 0 }); return; }
    try {
      const res = await getCart(user.id);
      setCart(res.data);
    } catch (e) { console.error('Failed to fetch cart', e); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addItem = async (item) => {
    if (!user) return;
    try {
      await addToCart({ userId: user.id, ...item });
      toast.success('Added to cart!');
      await fetchCart();
    } catch (e) { toast.error('Failed to add to cart'); }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateCart({ userId: user.id, productId, quantity });
      await fetchCart();
    } catch (e) { toast.error('Failed to update cart'); }
  };

  const removeItem = async (productId) => {
    try {
      await removeFromCart(user.id, productId);
      toast.success('Removed from cart');
      await fetchCart();
    } catch (e) { toast.error('Failed to remove item'); }
  };

  const clear = async () => {
    try {
      await clearCart(user.id);
      await fetchCart();
    } catch (e) {}
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addItem, updateQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
};
