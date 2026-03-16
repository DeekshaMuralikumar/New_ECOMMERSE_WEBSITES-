import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { Package, TrendingUp, DollarSign, Plus, MessageSquare, X, Send } from 'lucide-react';
import '../shared/Dashboard.css';

const FbaDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, revenue: 0, inventoryFees: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', availableQuantity: '', weight: '', categoryId: '' });
  const [categories, setCategories] = useState([]);
  const [stockInputs, setStockInputs] = useState({});

  // Messaging
  const [showMessaging, setShowMessaging] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchFbaData();
  }, [user]);

  const fetchFbaData = async () => {
    if (!user?.id) return;
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get(`/products/owner/${user.id}`).catch(() => ({data: []})),
        axiosInstance.get('/categories').catch(() => ({data: []}))
      ]);
      const prods = prodRes.data || [];
      setProducts(prods);
      console.log("Categories raw data:", catRes.data);
      let allCats = [];
      if (Array.isArray(catRes.data) && catRes.data.length > 0) {
        allCats = catRes.data;
      } else {
        allCats = ["Laptop", "Phone", "human", "Tv", "Fridge"].map((name, index) => ({ id: index + 1000, name }));
      }
      setCategories(allCats);

      const totalWeightKg = prods.reduce((acc, p) => acc + (p.weight || 0) * p.availableQuantity, 0);
      const inventoryFees = (totalWeightKg / 1000) * 500;
      const mockRawRevenue = 100000;
      const netRevenue = mockRawRevenue * 0.85;

      setStats({ totalSales: 450, revenue: netRevenue, inventoryFees });
    } catch (err) {
      console.error("Error fetching FBA data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!user?.id) { alert("Cannot determine merchant ID."); return; }
    try {
      await axiosInstance.post(`/products?ownerId=${user.id}`, {
        ...newProduct,
        price: parseFloat(newProduct.price),
        availableQuantity: parseInt(newProduct.availableQuantity),
        weight: parseFloat(newProduct.weight) || 0,
      });
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', availableQuantity: '', weight: '', categoryId: '' });
      fetchFbaData();
      alert("Product submitted to warehouse. Waiting for admin approval.");
    } catch (err) {
      alert("Failed to submit product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleAd = async (productId, currentStatus) => {
    try {
      if (currentStatus) {
        await axiosInstance.post(`/ads/disable/${productId}`);
        alert("Advertisement disabled.");
      } else {
        await axiosInstance.post(`/ads/enable/${productId}`);
        alert("Advertisement enabled! This product will now be promoted.");
      }
      fetchFbaData();
    } catch {
      alert("Failed to update advertisement status.");
    }
  };

  const openChat = async () => {
    try {
      const adminRes = await axiosInstance.get('/users/role/ADMIN');
      const admins = adminRes.data || [];
      if (admins.length > 0) {
        setAdminId(admins[0].id);
        const msgRes = await axiosInstance.get(`/messages?user1=${user.id}&user2=${admins[0].id}`);
        setMessages(msgRes.data || []);
      }
    } catch { setMessages([]); }
    setShowMessaging(true);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !adminId) return;
    try {
      await axiosInstance.post(`/messages?senderId=${user.id}&receiverId=${adminId}&content=${encodeURIComponent(newMessage)}`);
      setMessages(prev => [...prev, { senderId: user.id, content: newMessage }]);
      setNewMessage('');
    } catch { alert("Failed to send message."); }
  };

  const handlePayStorageFee = async () => {
  if (!window.confirm(`Pay ₹${stats.inventoryFees.toFixed(2)} storage fees?`)) return;
  try {
    await axiosInstance.post(`/fba/pay-storage/${user.id}`, { amount: stats.inventoryFees });
    // Refresh data to show updated balance (you can add a wallet balance to stats)
    setStats(prev => ({ ...prev, inventoryFees: 0 }));
    alert("Payment successful!");
  } catch (err) {
    alert("Payment failed: " + (err.response?.data?.message || err.message));
  }
};
  if (loading) return <div className="container" style={{padding: '4rem'}}>Loading dashboard...</div>;

  return (
    <div className="container dashboard-container">
      <h1 className="dashboard-header">FBA Merchant Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#dbeafe', color: '#1e40af'}}><Package size={24} /></div>
          <div className="stat-details">
            <div className="stat-title">Products In Warehouse</div>
            <div className="stat-value">{products.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#dcfce7', color: '#166534'}}><TrendingUp size={24} /></div>
          <div className="stat-details">
            <div className="stat-title">Net Revenue (After 15% Comm.)</div>
            <div className="stat-value">₹{stats.revenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: '#fef2f2', color: '#dc2626'}}>
            <DollarSign size={24} />
          </div>
          <div className="stat-details">
            <div className="stat-title">Unpaid Storage Fees</div>
            <div className="stat-value" style={{color: 'var(--color-danger)'}}>₹{stats.inventoryFees.toFixed(2)}</div>
<button className="btn btn-outline" onClick={handlePayStorageFee} style={{marginTop: '0.5rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem'}}>
  Pay Now
</button>          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-title">
          <span>Warehouse Inventory</span>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button className="btn btn-outline" onClick={openChat}>
              <MessageSquare size={18} style={{marginRight: '0.5rem'}}/> Message Admin
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(!showAddModal)}>
              <Plus size={18} style={{marginRight: '0.5rem'}}/> Submit Product
            </button>
          </div>
        </div>

        {showAddModal && (
           <form className="auth-form" onSubmit={handleAddProduct} style={{background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="input-control" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Merchant Price</label>
                <input type="number" className="input-control" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity Provided</label>
                <input type="number" className="input-control" value={newProduct.availableQuantity} onChange={e => setNewProduct({...newProduct, availableQuantity: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Total Weight (KG)</label>
                <input type="number" className="input-control" value={newProduct.weight} onChange={e => setNewProduct({...newProduct, weight: e.target.value})} required />
              </div>
              <div className="form-group" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Category</label>
                <select className="input-control" value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} required>
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{gridColumn: 'span 2'}}>
                <label className="form-label">Description</label>
                <textarea className="input-control" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-success">Submit to Warehouse</button>
          </form>
        )}

        <div style={{overflowX: 'auto'}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Weight (KG)</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Ads</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight: '600'}}>{p.name}</td>
                  <td>{p.categoryId}</td>
                  <td>₹{p.price?.toFixed(2)}</td>
                  <td>{p.availableQuantity}</td>
                  <td>{p.weight || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${p.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${p.verificationStatus === 'APPROVED' ? 'badge-success' : (p.verificationStatus === 'REJECTED' ? 'badge-danger' : 'badge-warning')}`}>
                      {p.verificationStatus || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`btn ${p.isAdvertised ? 'btn-success' : 'btn-outline'}`} 
                      style={{padding: '0.2rem 0.5rem', fontSize: '0.8rem'}} 
                      onClick={() => handleToggleAd(p.id, p.isAdvertised)}
                    >
                      {p.isAdvertised ? 'Promoted' : 'Promote'}
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)'}}>
                    No products submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Messaging Modal */}
      {showMessaging && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:'var(--radius-lg)',padding:'2rem',width:'500px',maxHeight:'70vh',display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{margin:0}}>Message Admin</h2>
              <button onClick={() => setShowMessaging(false)} style={{background:'none',border:'none',cursor:'pointer'}}><X size={22}/></button>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:'0.5rem',display:'flex',flexDirection:'column',gap:'0.5rem',background:'#f8fafc',borderRadius:'var(--radius-sm)',minHeight:'200px'}}>
              {messages.map((m, i) => {
                const isMine = String(m.senderId || m.sender?.id) === String(user.id);
                return (
                  <div key={i} style={{alignSelf:isMine?'flex-end':'flex-start',background:isMine?'var(--color-primary)':'#e2e8f0',color:isMine?'white':'#1e293b',padding:'0.5rem 1rem',borderRadius:'1rem',maxWidth:'75%'}}>
                    {m.content}
                  </div>
                );
              })}
              {messages.length === 0 && <div style={{textAlign:'center',color:'var(--color-text-secondary)',marginTop:'2rem'}}>Send a message to Admin!</div>}
            </div>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <input className="input-control" value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Type a message..." style={{flex:1}} />
              <button className="btn btn-primary" onClick={sendMessage}><Send size={16}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FbaDashboard;
