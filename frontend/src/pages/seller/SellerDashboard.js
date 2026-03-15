import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { Package, TrendingUp, AlertTriangle, Plus, MessageSquare, X, Send } from 'lucide-react';
import '../shared/Dashboard.css';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, revenue: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', availableQuantity: '', weight: '', categoryId: '' });
  const [stockInputs, setStockInputs] = useState({});
  const [adClicks, setAdClicks] = useState({});

  // Messaging state
  const [showMessaging, setShowMessaging] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const [prodRes, ordersRes, catRes] = await Promise.all([
        axiosInstance.get(`/products/owner/${user.id}`),
        axiosInstance.get(`/orders/seller/${user.id}`).catch(() => ({ data: [] })),
        axiosInstance.get('/categories').catch(() => ({ data: [] }))
      ]);
      setProducts(prodRes.data);
      setOrders(ordersRes.data);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setStats({
        totalProducts: prodRes.data.length,
        revenue: 0,
        lowStock: prodRes.data.filter(p => p.availableQuantity <= 5).length
      });
      prodRes.data.forEach(async p => {
        try {
          const res = await axiosInstance.get(`/ads/clicks/${p.id}`);
          setAdClicks(prev => ({ ...prev, [p.id]: res.data }));
        } catch { /* ignore */ }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/products?ownerId=${user.id}`, {
        ...newProduct,
        price: parseFloat(newProduct.price),
        availableQuantity: parseInt(newProduct.availableQuantity),
        weight: parseFloat(newProduct.weight) || 0
      });
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', availableQuantity: '', weight: '', categoryId: '' });
      fetchData();
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const handleAddStock = async (productId) => {
    const qty = parseInt(stockInputs[productId]);
    if (!qty) return;
    try {
      await axiosInstance.put(`/products/${productId}/stock?quantity=${qty}`);
      setStockInputs(prev => ({ ...prev, [productId]: '' }));
      fetchData();
    } catch { alert('Failed'); }
  };

  const handleToggleAd = async (productId, current) => {
    try {
      if (current) await axiosInstance.post(`/ads/disable/${productId}`);
      else await axiosInstance.post(`/ads/enable/${productId}`);
      fetchData();
    } catch { alert('Failed'); }
  };

  // Messaging handlers
  const openMessaging = async () => {
    try {
      // Fetch admin user(s)
      const adminRes = await axiosInstance.get('/users/role/ADMIN');
      const admins = adminRes.data || [];
      if (admins.length === 0) {
        alert("No admin available to message.");
        return;
      }
      // For simplicity, use the first admin
      const admin = admins[0];
      setAdminId(admin.id);

      // Fetch conversation with this admin
      const msgRes = await axiosInstance.get(`/messages?user1=${user.id}&user2=${admin.id}`);
      setMessages(msgRes.data || []);
    } catch (err) {
      console.error("Failed to open messaging", err);
      setMessages([]);
    }
    setShowMessaging(true);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !adminId) return;
    try {
      await axiosInstance.post(`/messages?senderId=${user.id}&receiverId=${adminId}&content=${encodeURIComponent(newMessage)}`);
      setMessages(prev => [...prev, { senderId: user.id, content: newMessage, sentAt: new Date().toISOString() }]);
      setNewMessage('');
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container dashboard-container">
      <h1 className="dashboard-header">Seller Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Package /></div>
          <div>
            <div className="stat-title">Products</div>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><TrendingUp /></div>
          <div>
            <div className="stat-title">Revenue</div>
            <div className="stat-value">₹{stats.revenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><AlertTriangle /></div>
          <div>
            <div className="stat-title">Low Stock</div>
            <div className="stat-value">{stats.lowStock}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className="btn btn-outline" style={{ marginLeft: 'auto' }} onClick={openMessaging}>
          <MessageSquare size={16} style={{ marginRight: '0.4rem' }} /> Message Admin
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="dashboard-section">
          <div className="section-title">
            <span>My Products</span>
            <button className="btn btn-primary" onClick={() => setShowAddModal(!showAddModal)}><Plus size={18} /> Add Product</button>
          </div>
          {showAddModal && (
            <form onSubmit={handleAddProduct} className="auth-form" style={{ background: '#f8fafc', padding: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group"><label>Name</label><input className="input-control" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required /></div>
              <div className="form-group"><label>Price</label><input type="number" className="input-control" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required /></div>
              <div className="form-group"><label>Quantity</label><input type="number" className="input-control" value={newProduct.availableQuantity} onChange={e => setNewProduct({...newProduct, availableQuantity: e.target.value})} required /></div>
              <div className="form-group"><label>Weight (KG) - optional</label><input type="number" className="input-control" value={newProduct.weight} onChange={e => setNewProduct({...newProduct, weight: e.target.value})} /></div>
              <div className="form-group"><label>Category</label>
                <select className="input-control" value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} required>
                  <option value="">Select</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Description</label><textarea className="input-control" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required /></div>
              <button type="submit" className="btn btn-success">Submit</button>
            </form>
          )}
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Clicks</th>
                <th>Add Stock</th>
                <th>Ads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>₹{p.price?.toFixed(2)}</td>
                  <td>{p.availableQuantity}</td>
                  <td><span className={`status-badge ${p.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span></td>
                  <td><span className={`status-badge ${p.verificationStatus === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>{p.verificationStatus}</span></td>
                  <td>{adClicks[p.id] || 0}</td>
                  <td>
                    <input type="number" style={{ width: '60px' }} value={stockInputs[p.id] || ''} onChange={e => setStockInputs(prev => ({...prev, [p.id]: e.target.value}))} />
                    <button className="btn btn-outline" onClick={() => handleAddStock(p.id)}>Add</button>
                  </td>
                  <td>
                    <button className={`btn ${p.isAdvertised ? 'btn-success' : 'btn-outline'}`} onClick={() => handleToggleAd(p.id, p.isAdvertised)}>
                      {p.isAdvertised ? 'Promoted' : 'Promote'}
                    </button>
                  </td>
                  <td><button className="btn btn-outline btn-danger">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="dashboard-section">
          <h2 className="section-title">Orders</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>₹{o.totalAmount?.toFixed(2)}</td>
                  <td><span className={`status-badge badge-${o.status}`}>{o.status}</span></td>
                  <td>
                    {o.status === 'CREATED' && <button className="btn btn-outline" onClick={() => axiosInstance.put(`/orders/${o.id}/confirm`).then(fetchData)}>Confirm</button>}
                    {o.status === 'CONFIRMED' && <button className="btn btn-outline" onClick={() => axiosInstance.put(`/orders/${o.id}/ship`).then(fetchData)}>Ship</button>}
                    {o.status === 'SHIPPED' && <button className="btn btn-outline" onClick={() => axiosInstance.put(`/orders/${o.id}/deliver`).then(fetchData)}>Deliver</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Messaging Modal */}
      {showMessaging && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '500px', maxWidth: '90%' }}>
            <div className="modal-header">
              <h2>Message Admin</h2>
              <button className="modal-close" onClick={() => setShowMessaging(false)}>
                <X size={22} />
              </button>
            </div>
            <div className="chat-area" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
              <div className="messages-container" style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                {messages.map((msg, index) => {
  // Determine if message is from current user (handle both senderId and sender object)
  const senderId = msg.senderId || msg.sender?.id;
  const isMine = String(senderId) === String(user.id);
  return (
    <div key={index} className={`message ${isMine ? 'mine' : 'theirs'}`}>
      {msg.content}
    </div>
                  );
                })}
                {messages.length === 0 && <p className="no-messages">No messages yet. Start the conversation!</p>}
              </div>
              <div className="message-input" style={{ display: 'flex', gap: '0.5rem' }}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;