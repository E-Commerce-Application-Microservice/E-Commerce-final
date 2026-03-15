import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShipping } from '../api';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TrackPackage() {
  const { orderId } = useParams();
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShipping(orderId)
      .then(res => {
        setShipping(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Could not fetch shipping details');
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div></div>;

  if (!shipping) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
      <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
        <FiPackage size={40} className="text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">No Tracking Found</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">We couldn't find any shipping information for this order yet.</p>
      <Link to="/orders" className="btn-primary inline-block">Back to Orders</Link>
    </div>
  );

  const steps = [
    { id: 'processing', icon: <FiClock />, label: 'Order Processing' },
    { id: 'picked_up', icon: <FiPackage />, label: 'Picked Up by Carrier' },
    { id: 'in_transit', icon: <FiTruck />, label: 'In Transit' },
    { id: 'out_for_delivery', icon: <FiMapPin />, label: 'Out for Delivery' },
    { id: 'delivered', icon: <FiHome />, label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === shipping.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-8 text-sm">
        <Link to="/orders" className="text-gray-400 hover:text-purple-400 transition-colors">Orders</Link>
        <span className="text-gray-600">/</span>
        <span className="text-white">Track Order {orderId.substring(0, 8)}...</span>
      </div>

      <div className="glass-card p-6 md:p-10 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <FiTruck size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Tracking Status</h1>
              <p className="text-gray-400 font-mono">Tracking #: <span className="text-purple-400">{shipping.trackingNumber}</span></p>
              <p className="text-gray-400">Carrier: {shipping.carrier}</p>
            </div>
            
            {shipping.status !== 'delivered' && (
              <div className="text-left md:text-right bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Estimated Delivery</p>
                <p className="text-xl font-bold text-white">
                  {new Date(shipping.estimatedDelivery).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
              </div>
            )}
            
            {shipping.status === 'delivered' && (
              <div className="text-left md:text-right bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                <p className="text-sm text-green-400 mb-1 flex items-center justify-end gap-2"><FiCheckCircle /> Delivered Successfully</p>
                <p className="font-medium text-white">Your package has arrived</p>
              </div>
            )}
          </div>

          {/* Timeline Bar */}
          <div className="relative pt-10 pb-16 hidden md:block border-b border-white/10 mb-10">
            <div className="absolute left-0 right-0 h-1 bg-white/10 top-16 -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 top-16 -z-10 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(0, currentStepIndex) * (100 / (steps.length - 1))}%` }}
            ></div>
            
            <div className="flex justify-between relative">
              {steps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                return (
                  <div key={step.id} className="flex flex-col items-center relative w-24 text-center group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' : 'bg-[#1a1a2e] border-2 border-white/10 text-gray-500'}`}>
                      {isActive && idx < currentStepIndex ? <FiCheckCircle size={24} /> : React.cloneElement(step.icon, { size: 24 })}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-6">Tracking Details</h3>
          <div className="space-y-6">
            {shipping.updates.slice().reverse().map((update, idx) => (
              <div key={idx} className="flex gap-6 relative">
                {idx !== shipping.updates.length - 1 && (
                  <div className="absolute top-10 bottom-[-24px] left-[15px] w-px bg-white/10"></div>
                )}
                <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-[#1a1a2e] border border-white/20 text-purple-400">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
                <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                    <h4 className="font-semibold text-white capitalize">{update.status.replace('_', ' ')}</h4>
                    <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {new Date(update.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{update.description}</p>
                  {update.location && (
                    <p className="text-xs text-purple-400 flex items-center gap-1"><FiMapPin size={12}/> {update.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      
      {/* Shipping Address */}
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><FiHome /> Shipping Destination</h3>
        <div className="text-gray-300">
          <p className="font-medium text-white mb-1">{shipping.shippingAddress?.name}</p>
          <p>{shipping.shippingAddress?.address}</p>
          <p>{shipping.shippingAddress?.city}, {shipping.shippingAddress?.state} {shipping.shippingAddress?.zipCode}</p>
        </div>
      </div>
    </div>
  );
}
