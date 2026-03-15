import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Store, Package } from 'lucide-react';
import '../shared/Dashboard.css';

const SellerProfile = () => {
  const { user } = useAuth();

  return (
    <div className="container" style={{padding: '4rem 2rem'}}>
      <div className="auth-card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <div className="auth-header" style={{textAlign: 'left', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
             <div style={{background: '#dbeafe', color: '#1e40af', padding: '1rem', borderRadius: '50%'}}>
               <Store size={32} />
             </div>
             <div>
               <h1 style={{margin: 0}}>{user?.name}</h1>
               <span className="status-badge badge-warning" style={{marginTop: '0.5rem'}}>Marketplace Seller</span>
             </div>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
          <div className="profile-section">
            <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <User size={20} /> Seller Info
            </h3>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <div style={{padding: '0.8rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Mail size={16} /> {user?.email}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Package size={20} /> Fulfillment
            </h3>
            <p style={{color: 'var(--color-text-secondary)'}}>Self-managed fulfillment model.</p>
            <div style={{marginTop: '1rem'}}>
                <button className="btn btn-outline" style={{width: '100%', marginBottom: '0.5rem'}}>Store Settings</button>
                <button className="btn btn-primary" style={{width: '100%'}}>View Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
