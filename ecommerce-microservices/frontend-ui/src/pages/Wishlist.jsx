import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist(user.id);
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(user.id, productId);
      setItems(items.filter(i => i.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (item) => {
    addItem({ productId: item.productId, name: item.name, image: item.image, price: item.price, quantity: 1 });
    handleRemove(item.productId);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
          <FiHeart size={40} className="text-pink-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">Save your favorite items here to purchase them later.</p>
        <Link to="/products" className="btn-primary inline-block">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <FiHeart size={28} className="text-pink-500" />
        <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
        <span className="bg-white/10 text-gray-300 text-sm py-1 px-3 rounded-full ml-2">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item._id} className="product-card group flex flex-col h-full bg-[#161625]">
            <Link to={`/product/${item.productId}`} className="block relative aspect-square overflow-hidden bg-white/5">
              <img src={item.image || 'https://via.placeholder.com/300'} alt={item.name} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
            </Link>
            <div className="p-5 flex-1 flex flex-col">
              <Link to={`/product/${item.productId}`} className="flex-1">
                <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 hover:text-purple-400 transition-colors">{item.name}</h3>
              </Link>
              <div className="text-xl font-bold text-white mb-4">${item.price?.toFixed(2)}</div>
              
              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => handleMoveToCart(item)}
                  className="flex-1 btn-primary py-2 px-3 text-sm flex items-center justify-center gap-2"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <button 
                  onClick={() => handleRemove(item.productId)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-pink-500/20 hover:text-pink-500 text-gray-400 transition-colors"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
