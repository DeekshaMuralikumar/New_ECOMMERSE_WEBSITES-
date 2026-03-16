import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import '../shared/Dashboard.css';
import { Users, DollarSign, ListOrdered, CheckCircle, Plus, MessageSquare, X, Send } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, pendingOrders: 0, revenue: 0, pendingVerifications: 0 });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [categories, setCategories] = useState([]);

  // Product form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', availableQuantity: '', weight: '', categoryId: '' });

  // Messaging state
  const [showMessaging, setShowMessaging] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Return/Refund modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnAction, setReturnAction] = useState(''); // 'approve' or 'reject'
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, prodRes, ordersRes, pendingRes, catRes, revenueRes] = await Promise.all([
        axiosInstance.get('/users'),
        axiosInstance.get('/admin/products/all'),
        axiosInstance.get('/orders').catch(() => ({ data: [] })),
        axiosInstance.get('/users/pending').catch(() => ({ data: [] })),
        axiosInstance.get('/categories').catch(() => ({ data: [] })),
        axiosInstance.get('/admin/revenue').catch(() => ({ data: { revenue: 0 } })),
      ]);

      const allUsers = usersRes.data || [];
      const allProducts = prodRes.data || [];
      const allOrders = ordersRes.data || [];
      const pendingList = pendingRes.data || [];

      setStats({
        users: allUsers.length,
        pendingOrders: allOrders.filter(o => o.status === 'CREATED').length,
        revenue: revenueRes.data.revenue || 0,
        pendingVerifications: pendingList.length,
      });
      setProducts(allProducts);
      setOrders(allOrders);
      setPendingUsers(pendingList);
      setPendingProducts(allProducts.filter(p => p.verificationStatus === 'PENDING'));
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  // User verification handlers
  const handleVerifyUser = async (userId, status) => {
    try {
      await axiosInstance.put(`/users/${userId}/verify?status=${status}`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  // Product approval handlers
  const handleApproveProduct = async (productId) => {
    try {
      await axiosInstance.put(`/admin/approve-product/${productId}`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to approve product.");
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      await axiosInstance.put(`/admin/reject-product/${productId}`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to reject product.");
    }
  };

  // Add product (admin)
  const handleAdminAddProduct = async (e) => {
    e.preventDefault();
    if (!user?.id) { alert("Could not determine admin ID."); return; }
    try {
      await axiosInstance.post(`/products?ownerId=${user.id}`, {
        ...newProduct,
        price: parseFloat(newProduct.price),
        availableQuantity: parseInt(newProduct.availableQuantity),
        weight: parseFloat(newProduct.weight) || 0,
      });
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', availableQuantity: '', weight: '', categoryId: '' });
      fetchAdminData();
      alert("Product added successfully!");
    } catch (err) {
      alert("Failed to add product: " + (err.response?.data?.message || err.message));
    }
  };

  // Order status update handlers
  const handleConfirmOrder = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/confirm`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to confirm order.");
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/ship`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to ship order.");
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/deliver`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to deliver order.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axiosInstance.put(`/orders/${orderId}/cancel`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to cancel order.");
    }
  };

  // Return/Refund handlers
  const openReturnModal = (order, action) => {
    setSelectedOrder(order);
    setReturnAction(action);
    setRefundAmount(order.totalAmount); // default full refund
    setShowReturnModal(true);
  };

  const handleApproveReturn = async () => {
    if (!selectedOrder) return;
    try {
      // Assuming backend has endpoint: /orders/{id}/approve-return
      await axiosInstance.put(`/orders/${selectedOrder.id}/approve-return`);
      fetchAdminData();
      setShowReturnModal(false);
      alert("Return approved. Refund will be processed.");
    } catch (err) {
      alert("Failed to approve return.");
    }
  };

  const handleRejectReturn = async () => {
    if (!selectedOrder) return;
    try {
      // Assuming backend has endpoint: /orders/{id}/reject-return
      await axiosInstance.put(`/orders/${selectedOrder.id}/reject-return`);
      fetchAdminData();
      setShowReturnModal(false);
      alert("Return rejected.");
    } catch (err) {
      alert("Failed to reject return.");
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedOrder) return;
    try {
      // Assuming backend has endpoint: /orders/{id}/refund?amount=...
      await axiosInstance.put(`/orders/${selectedOrder.id}/refund?amount=${refundAmount}`);
      fetchAdminData();
      setShowReturnModal(false);
      alert("Refund processed.");
    } catch (err) {
      alert("Failed to process refund.");
    }
  };

  // Messaging handlers
  const openMessaging = async () => {
    try {
      const [sellerRes, fbaRes] = await Promise.all([
        axiosInstance.get('/users/role/SELLER'),
        axiosInstance.get('/users/role/FBA_MERCHANT')
      ]);
      setSellers([...(sellerRes.data || []), ...(fbaRes.data || [])]);
    } catch (err) {
      console.error("Failed to fetch sellers", err);
      setSellers([]);
    }
    setShowMessaging(true);
  };

  const openChat = async (seller) => {
    setSelectedSeller(seller);
    try {
      const res = await axiosInstance.get(`/messages?user1=${user.id}&user2=${seller.id}`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages", err);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSeller) return;
    try {
      await axiosInstance.post(`/messages?senderId=${user.id}&receiverId=${selectedSeller.id}&content=${encodeURIComponent(newMessage)}`);
      setMessages(prev => [...prev, { senderId: user.id, content: newMessage, sentAt: new Date().toISOString() }]);
      setNewMessage('');
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading Admin Dashboard...</div>;

  return (
    <div className="container dashboard-container">
      <h1 className="dashboard-header">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#1e40af' }}><Users size={24} /></div>
          <div className="stat-details"><div className="stat-title">Total Users</div><div className="stat-value">{stats.users}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}><ListOrdered size={24} /></div>
          <div className="stat-details"><div className="stat-title">Pending Orders</div><div className="stat-value">{stats.pendingOrders}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#166534' }}><DollarSign size={24} /></div>
          <div className="stat-details"><div className="stat-title">Platform Revenue</div><div className="stat-value">₹{stats.revenue.toFixed(2)}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><CheckCircle size={24} /></div>
          <div className="stat-details"><div className="stat-title">Pending Verifications</div><div className="stat-value">{stats.pendingVerifications}</div></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
        <button className={activeTab === 'userVerifications' ? 'active' : ''} onClick={() => setActiveTab('userVerifications')}>User Verifications</button>
        <button className={activeTab === 'productVerifications' ? 'active' : ''} onClick={() => setActiveTab('productVerifications')}>Product Approvals</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className="btn btn-outline" style={{ marginLeft: 'auto' }} onClick={openMessaging}>
          <MessageSquare size={16} style={{ marginRight: '0.4rem' }} /> Message Sellers
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-section">
          <p style={{ color: 'var(--color-text-secondary)' }}>Select a tab above to manage products, orders, or verifications.</p>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="dashboard-section">
          <div className="section-title">
            <span>All Products</span>
            <button className="btn btn-primary" onClick={() => setShowAddModal(!showAddModal)}>
              <Plus size={18} style={{ marginRight: '0.4rem' }} /> Add Product
            </button>
          </div>
          {showAddModal && (
            <form className="auth-form" onSubmit={handleAdminAddProduct} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[['name', 'Product Name', 'text'], ['price', 'Price', 'number'], ['availableQuantity', 'Quantity', 'number'], ['weight', 'Weight (KG)', 'number']].map(([field, label, type]) => (
                  <div key={field} className="form-group">
                    <label className="form-label">{label}</label>
                    <input type={type} className="input-control" value={newProduct[field]} onChange={e => setNewProduct({ ...newProduct, [field]: e.target.value })} required={field !== 'weight'} min={type === 'number' ? "0" : undefined} step={type === 'number' ? "0.01" : undefined} />
                  </div>
                ))}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Category</label>
                  <select className="input-control" value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Description</label>
                  <textarea className="input-control" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-success">Publish Product</button>
            </form>
          )}
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>₹{p.price?.toFixed(2)}</td>
                  <td>{p.availableQuantity}</td>
                  <td><span className={`status-badge ${p.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span></td>
                  <td>
                    <span className={`status-badge ${p.verificationStatus === 'APPROVED' ? 'badge-success' : p.verificationStatus === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                      {p.verificationStatus || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Verifications Tab */}
      {activeTab === 'userVerifications' && (
        <div className="dashboard-section">
          <h2 className="section-title">Pending Seller/FBA Verifications</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name || 'N/A'}</td>
                  <td>{u.email}</td>
                  <td><span className="status-badge badge-warning">{u.role}</span></td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ color: 'green', borderColor: 'green', padding: '0.3rem 0.7rem' }} onClick={() => handleVerifyUser(u.id, 'APPROVED')}>Approve</button>
                    <button className="btn btn-outline" style={{ color: 'red', borderColor: 'red', padding: '0.3rem 0.7rem' }} onClick={() => handleVerifyUser(u.id, 'REJECTED')}>Reject</button>
                  </td>
                </tr>
              ))}
              {pendingUsers.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No pending verifications.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Verifications Tab */}
      {activeTab === 'productVerifications' && (
        <div className="dashboard-section">
          <h2 className="section-title">Pending Product Approvals</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Seller ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>₹{p.price?.toFixed(2)}</td>
                  <td>{p.availableQuantity}</td>
                  <td>{p.ownerId}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-outline" style={{ color: 'green', borderColor: 'green', padding: '0.3rem 0.7rem' }} onClick={() => handleApproveProduct(p.id)}>Approve</button>
                    <button className="btn btn-outline" style={{ color: 'red', borderColor: 'red', padding: '0.3rem 0.7rem' }} onClick={() => handleRejectProduct(p.id)}>Reject</button>
                  </td>
                </tr>
              ))}
              {pendingProducts.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No pending product approvals.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab - Enhanced with Actions */}
      {activeTab === 'orders' && (
        <div className="dashboard-section">
          <h2 className="section-title">All Orders</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Return Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customer?.name || o.customer?.email || 'N/A'}</td>
                  <td>₹{o.totalAmount?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge 
                      ${o.status === 'DELIVERED' ? 'badge-success' : 
                        o.status === 'CANCELLED' ? 'badge-danger' : 
                        o.status === 'RETURN_REQUESTED' ? 'badge-warning' :
                        o.status === 'RETURN_APPROVED' ? 'badge-info' :
                        o.status === 'REFUNDED' ? 'badge-secondary' :
                        'badge-warning'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td>{o.returnReason || '-'}</td>
                  <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {o.status === 'CREATED' && (
                      <>
                        <button className="btn btn-outline btn-sm" onClick={() => handleConfirmOrder(o.id)}>Confirm</button>
                        <button className="btn btn-outline btn-sm" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleCancelOrder(o.id)}>Cancel</button>
                      </>
                    )}
                    {o.status === 'CONFIRMED' && (
                      <>
                        <button className="btn btn-outline btn-sm" onClick={() => handleShipOrder(o.id)}>Ship</button>
                        <button className="btn btn-outline btn-sm" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleCancelOrder(o.id)}>Cancel</button>
                      </>
                    )}
                    {o.status === 'SHIPPED' && (
                      <>
                        <button className="btn btn-outline btn-sm" onClick={() => handleDeliverOrder(o.id)}>Deliver</button>
                        <span className="text-muted">Cannot cancel</span>
                      </>
                    )}
                    {o.status === 'DELIVERED' && (
                      <>
                        {o.returnReason ? (
                          <button className="btn btn-outline btn-sm" onClick={() => openReturnModal(o, 'approve')}>Approve Return</button>
                        ) : (
                          <span>Delivered</span>
                        )}
                      </>
                    )}
                    {o.status === 'RETURN_REQUESTED' && (
                      <>
                        <button className="btn btn-outline btn-sm" style={{ color: 'green' }} onClick={() => openReturnModal(o, 'approve')}>Approve</button>
                        <button className="btn btn-outline btn-sm" style={{ color: 'red' }} onClick={() => openReturnModal(o, 'reject')}>Reject</button>
                      </>
                    )}
                    {o.status === 'RETURN_APPROVED' && (
                      <button className="btn btn-outline btn-sm" onClick={() => openReturnModal(o, 'refund')}>Process Refund</button>
                    )}
                    {o.status === 'REFUNDED' && (
                      <span>Refunded</span>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Messaging Modal */}
      {showMessaging && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '700px', maxWidth: '90%' }}>
            <div className="modal-header">
              <h2>Message Sellers</h2>
              <button className="modal-close" onClick={() => { setShowMessaging(false); setSelectedSeller(null); }}>
                <X size={22} />
              </button>
            </div>
            <div className="messaging-layout">
              <div className="seller-list">
                <h4>Sellers / FBA Merchants</h4>
                {sellers.map(s => (
                  <div
                    key={s.id}
                    className={`seller-item ${selectedSeller?.id === s.id ? 'selected' : ''}`}
                    onClick={() => openChat(s)}
                  >
                    <div className="seller-name">{s.name || s.email}</div>
                    <div className="seller-role">{s.role}</div>
                  </div>
                ))}
                {sellers.length === 0 && <p>No sellers found.</p>}
              </div>
              <div className="chat-area">
                {selectedSeller ? (
                  <>
                    <div className="chat-header">
                      Chat with {selectedSeller.name || selectedSeller.email}
                    </div>
                    <div className="messages-container">
                      {messages.map((m, i) => {
                        const senderId = m.senderId || m.sender?.id;
                        const isMine = String(senderId) === String(user.id);
                        return (
                          <div key={i} className={`message ${isMine ? 'mine' : 'theirs'}`}>
                            {m.content}
                          </div>
                        );
                      })}
                      {messages.length === 0 && <p className="no-messages">No messages yet. Start the conversation!</p>}
                    </div>
                    <div className="message-input">
                      <input
                        type="text"
                        className="input-control"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                      />
                      <button className="btn btn-primary" onClick={sendMessage}>
                        <Send size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="no-chat-selected">Select a seller to start messaging</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return/Refund Modal */}
      {showReturnModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '400px' }}>
            <div className="modal-header">
              <h2>
                {returnAction === 'approve' && 'Approve Return'}
                {returnAction === 'reject' && 'Reject Return'}
                {returnAction === 'refund' && 'Process Refund'}
              </h2>
              <button className="modal-close" onClick={() => setShowReturnModal(false)}>
                <X size={22} />
              </button>
            </div>
            <div style={{ padding: '1rem 0' }}>
              {returnAction === 'approve' && (
                <>
                  <p>Order #{selectedOrder.id}</p>
                  <p>Return Reason: {selectedOrder.returnReason}</p>
                  <p>Total Amount: ₹{selectedOrder.totalAmount?.toFixed(2)}</p>
                  <button className="btn btn-success" onClick={handleApproveReturn} style={{ width: '100%' }}>Confirm Approval</button>
                </>
              )}
              {returnAction === 'reject' && (
                <>
                  <p>Reject return for order #{selectedOrder.id}?</p>
                  <button className="btn btn-danger" onClick={handleRejectReturn} style={{ width: '100%' }}>Reject Return</button>
                </>
              )}
              {returnAction === 'refund' && (
                <>
                  <p>Order #{selectedOrder.id}</p>
                  <div className="form-group">
                    <label>Refund Amount (₹)</label>
                    <input
                      type="number"
                      className="input-control"
                      value={refundAmount}
                      onChange={e => setRefundAmount(parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      max={selectedOrder.totalAmount}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleProcessRefund} style={{ width: '100%' }}>Process Refund</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;