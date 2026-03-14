import React, { useState, useEffect } from 'react';
import { getOrders } from '../api';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getOrders(user.id).then(res => {
        setOrders(res.data || []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <FiCheckCircle />;
      case 'shipped': return <FiTruck />;
      default: return <FiPackage />;
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="glass-card py-20 text-center">
          <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-gray-400">You haven't placed any orders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="glass-card overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap gap-8 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1 uppercase text-xs tracking-wider">Order Placed</p>
                    <p className="font-medium text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1 uppercase text-xs tracking-wider">Total Amount</p>
                    <p className="font-medium text-white">${order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1 uppercase text-xs tracking-wider">Order ID</p>
                    <p className="font-medium text-white font-mono">{order._id.substring(0, 8)}...</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                   <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-8 items-center text-sm">
                     <div className="flex items-center gap-2 text-purple-400">
                       <FiTruck /> <span className="text-gray-300">Est. Delivery:</span> <span className="font-semibold text-white">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                     </div>
                     <button className="text-pink-400 hover:text-pink-300 font-medium transition-colors ml-auto">Track Package</button>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
