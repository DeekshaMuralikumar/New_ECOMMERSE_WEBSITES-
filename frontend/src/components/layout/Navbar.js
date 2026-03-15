import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitial = () => user?.email?.charAt(0).toUpperCase() || 'U';

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <Package size={28} />
          <span>E-Comm</span>
        </Link>

        <div className="navbar-nav desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
        </div>

        <div className="user-menu">
          {user?.role === 'CUSTOMER' && (
            <Link to="/cart" className="nav-link cart-icon-wrapper">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <>
              {user?.role === 'CUSTOMER' && (
                <Link to="/profile" className="nav-link">
                  <User size={20} />
                  <span className="desktop-only">Profile</span>
                </Link>
              )}
              {user?.role === 'SELLER' && (
                <Link to="/seller/dashboard" className="nav-link">
                  <LayoutDashboard size={20} />
                  <span className="desktop-only">Dashboard</span>
                </Link>
              )}
              {user?.role === 'FBA_MERCHANT' && (
                <Link to="/fba/dashboard" className="nav-link">
                  <LayoutDashboard size={20} />
                  <span className="desktop-only">FBA Hub</span>
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin/dashboard" className="nav-link">
                  <LayoutDashboard size={20} />
                  <span className="desktop-only">Admin</span>
                </Link>
              )}

              <div className="user-avatar">{getInitial()}</div>
              <button onClick={handleLogout} className="btn btn-outline">
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;