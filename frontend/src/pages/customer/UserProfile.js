import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { Package, User, Settings, LogOut, X } from 'lucide-react';
import './Profile.css';

const UserProfile = () => {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(user?.address || {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [updating, setUpdating] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders/my-orders?userId=${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      alert('Cannot cancel order.');
    }
  };

  const handleReturnOrder = async (orderId) => {
    const reason = prompt('Reason for return:');
    if (!reason) return;
    try {
      // Check 24h window
      const order = orders.find(o => o.id === orderId);
      const deliveredAt = new Date(order.updatedAt);
      const hoursDiff = (new Date() - deliveredAt) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        alert('Return window expired (24 hours).');
        return;
      }
      await axiosInstance.post(`/orders/${orderId}/return`, { return_reason: reason });
      fetchOrders();
      alert('Return requested.');
    } catch (err) {
      alert('Failed to request return.');
    }
  };

  const handleUpdateAddress = async () => {
    if (!addressData.street.trim() || !addressData.city.trim() || !addressData.state.trim() ||
      !addressData.zipCode.trim() || !addressData.country.trim()) {
      alert('Please fill in all address fields');
      return;
    }
    setUpdating(true);
    try {
      await axiosInstance.put(`/users/${user.id}/address`, addressData);
      alert('Address updated');
      await updateUser();
    } catch (err) {
      alert('Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenRateModal = (product) => {
    setSelectedProduct(product);
    setShowRateModal(true);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    try {
      await axiosInstance.post(`/reviews/${selectedProduct.id}?userId=${user.id}&rating=${rating}&comment=${encodeURIComponent(comment)}`);
      alert('Review submitted');
      setShowRateModal(false);
      setComment('');
      setRating(5);
    } catch (err) {
      alert('Failed to submit');
    }
  };

  return (
    <div className="container profile-container">
      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar-large">{user?.email?.charAt(0).toUpperCase()}</div>
          <div className="profile-name">{user?.name || 'Customer'}</div>
          <div className="profile-email">{user?.email}</div>
          <div className="profile-nav">
            <button className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <Package size={20} /> Order History
            </button>
            <button className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={20} /> Settings
            </button>
            <button className="profile-nav-btn" onClick={logout} style={{ color: 'var(--color-danger)', marginTop: '2rem' }}>
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>
        
        <div className="profile-content">
          {activeTab === 'orders' && (
            <div>
              <h2 className="profile-section-title">My Orders</h2>
              {loading ? <div>Loading...</div> : orders.length === 0 ? <div>No orders.</div> : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-id">Order #{order.id}</span>
                          <span> | </span>
                          <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className={`order-status-badge status-${order.status}`}>{order.status}</div>
                      </div>
                      <div className="order-card-body">
                        <div className="order-item-list">
                          {order.orderItems?.map(item => (
                            <div key={item.id} className="order-item-row">
                              <img src={item.productImage || '/placeholder.png'} alt={item.productName} className="order-item-img" />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{item.productName}</div>
                                <div>Qty: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}</div>
                              </div>
                              <div>₹{(item.quantity * item.priceAtPurchase).toFixed(2)}</div>
                              {order.status === 'DELIVERED' && (
                                <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem' }} onClick={() => handleOpenRateModal(item)}>
                                  Rate
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <div style={{ textAlign: 'right', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                          Total: ₹{order.totalAmount?.toFixed(2)}
                        </div>
                        <div className="order-actions">
                          {order.status === 'CREATED' && (
                            <button className="btn btn-outline" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => handleCancelOrder(order.id)}>
                              Cancel
                            </button>
                          )}
                          {order.status === 'DELIVERED' && (
                            <button className="btn btn-outline" onClick={() => handleReturnOrder(order.id)}>
                              Return
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'settings' && (
            <div>
              <h2 className="profile-section-title">Account Settings</h2>
              <form className="auth-form" style={{ maxWidth: '500px' }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="input-control" value={user?.email || ''} readOnly disabled />
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    className="input-control"
                    value={addressData.street}
                    onChange={e => setAddressData({ ...addressData, street: e.target.value })}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    className="input-control"
                    value={addressData.city}
                    onChange={e => setAddressData({ ...addressData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    className="input-control"
                    value={addressData.state}
                    onChange={e => setAddressData({ ...addressData, state: e.target.value })}
                    placeholder="Enter state"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    className="input-control"
                    value={addressData.zipCode}
                    onChange={e => setAddressData({ ...addressData, zipCode: e.target.value })}
                    placeholder="Enter ZIP code"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="input-control"
                    value={addressData.country}
                    onChange={e => setAddressData({ ...addressData, country: e.target.value })}
                    placeholder="Enter country"
                  />
                </div>

                <button type="button" className="btn btn-primary" onClick={handleUpdateAddress} disabled={updating}>
                  {updating ? 'Updating...' : 'Update Address'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      {showRateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Rate {selectedProduct?.productName}</h3>
              <button onClick={() => setShowRateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
            </div>
            <div className="form-group">
              <label>Rating</label>
              <select className="input-control" value={rating} onChange={e => setRating(parseInt(e.target.value))}>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea className="input-control" value={comment} onChange={e => setComment(e.target.value)} rows="4" />
            </div>
            <button className="btn btn-primary" onClick={handleSubmitReview}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;