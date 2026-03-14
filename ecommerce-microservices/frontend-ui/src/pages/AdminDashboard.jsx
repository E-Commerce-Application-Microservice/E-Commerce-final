import React, { useState, useEffect } from 'react';
import { getAdminDashboard, getAdminOrders, getAdminUsers } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    Promise.all([
      getAdminDashboard(),
      getAdminOrders({ limit: 10 })
    ]).then(([statRes, ordRes]) => {
      setStats(statRes.data);
      setOrders(ordRes.data.orders || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user, navigate]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><FiUsers size={24}/></div>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalOrders}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400"><FiShoppingBag size={24}/></div>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalProducts}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><FiBox size={24}/></div>
          </div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-green-500 flex flex-col justify-center items-center cursor-pointer hover:bg-white/10 transition-colors">
          <FiSettings size={28} className="text-gray-400 mb-2"/>
          <span className="text-white font-medium">Platform Settings</span>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-300 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono">{o._id.substring(0,8)}</td>
                  <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-white">${o.totalAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${o.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-purple-400 hover:text-purple-300 mr-3">Examine</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Need FiSettings so I will include it above
import { FiSettings } from 'react-icons/fi';
