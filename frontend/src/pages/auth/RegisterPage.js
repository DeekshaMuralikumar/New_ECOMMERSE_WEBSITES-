import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import './Auth.css';

const RegisterPage = () => {
  const [role, setRole] = useState('CUSTOMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 style={{ color: 'var(--color-success)' }}>Registration Successful!</h1>
          <p>You can now sign in.</p>
          {role !== 'CUSTOMER' && (
            <p style={{ marginTop: '1rem', color: 'var(--color-warning)' }}>
              Your account requires admin approval.
            </p>
          )}
          <br />
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our marketplace</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="role-selector">
          <div className={`role-tab ${role === 'CUSTOMER' ? 'active' : ''}`} onClick={() => setRole('CUSTOMER')} role="button">Customer</div>
          <div className={`role-tab ${role === 'SELLER' ? 'active' : ''}`} onClick={() => setRole('SELLER')} role="button">Seller</div>
          <div className={`role-tab ${role === 'FBA_MERCHANT' ? 'active' : ''}`} onClick={() => setRole('FBA_MERCHANT')} role="button">FBA Merchant</div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name
              <input type="text" name="name" className="input-control" value={formData.name} onChange={handleChange} required />
            </label>
          </div>
          <div className="form-group">
            <label className="form-label">Email
              <input type="email" name="email" className="input-control" value={formData.email} onChange={handleChange} required />
            </label>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Password
                 <input type="password" name="password" className="input-control" value={formData.password} onChange={handleChange} minLength={6} required />
              </label>
             
            </div>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label className="form-label">Confirm
                <input type="password" name="confirmPassword" className="input-control" value={formData.confirmPassword} onChange={handleChange} required />
              </label>
              
            </div>
          </div>
          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;