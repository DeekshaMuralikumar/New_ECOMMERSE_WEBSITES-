import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Package, 
  LayoutDashboard,
  Menu,
  X,
  Home,
  Store,
  ChevronDown,
  Heart,
  Settings,
  HelpCircle
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  const getInitial = () => user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getDashboardLink = () => {
    switch(user?.role) {
      case 'SELLER':
        return '/seller/dashboard';
      case 'FBA_MERCHANT':
        return '/fba/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/profile';
    }
  };

  const getRoleBadge = () => {
    switch(user?.role) {
      case 'SELLER':
        return <span className="role-badge seller">Seller</span>;
      case 'FBA_MERCHANT':
        return <span className="role-badge fba">FBA</span>;
      case 'ADMIN':
        return <span className="role-badge admin">Admin</span>;
      default:
        return null;
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="brand-icon">
            <Package size={28} />
          </div>
          <span className="brand-name">ShopEase</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
          >
            <Store size={18} />
            <span>Shop</span>
          </Link>
          {isAuthenticated && user?.role === 'CUSTOMER' && (
            <Link 
              to="/wishlist" 
              className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
            >
              {/* <Heart size={18} /> */}
              <span></span>
            </Link>
          )}
        </div>

        {/* Right Side Menu */}
        <div className="navbar-right">
          {/* Cart Icon - Only for Customers */}
          {user?.role === 'CUSTOMER' && (
            <Link to="/cart" className="cart-icon-wrapper">
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          )}

          {/* Desktop Auth Buttons */}
          <div className="desktop-auth">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Join Free</Link>
              </>
            ) : (
              <div className="profile-menu-container">
                <button 
                  className="profile-trigger"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      getInitial()
                    )}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.name || 'User'}</span>
                    {getRoleBadge()}
                  </div>
                  <ChevronDown size={16} className={`chevron ${isProfileMenuOpen ? 'rotated' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="profile-menu-backdrop" onClick={() => setIsProfileMenuOpen(false)} />
                    <div className="profile-menu">
                      <div className="profile-menu-header">
                        <div className="profile-menu-avatar">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                          ) : (
                            getInitial()
                          )}
                        </div>
                        <div className="profile-menu-info">
                          <span className="profile-menu-name">{user?.name || 'User'}</span>
                          <span className="profile-menu-email">{user?.email}</span>
                        </div>
                      </div>
                      <div className="profile-menu-divider" />
                      
                      <Link to={getDashboardLink()} className="profile-menu-item">
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link to="/profile" className="profile-menu-item">
                        <User size={18} />
                        <span>My Profile</span>
                      </Link>
                      
                      {/* <Link to="/settings" className="profile-menu-item">
                        <Settings size={18} />
                        <span>Settings</span>
                      </Link>
                      
                      <Link to="/help" className="profile-menu-item">
                        <HelpCircle size={18} />
                        <span>Help & Support</span>
                      </Link> */}
                      
                      <div className="profile-menu-divider" />
                      
                      <button onClick={handleLogout} className="profile-menu-item logout">
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/" className="mobile-nav-link">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/products" className="mobile-nav-link">
            <Store size={20} />
            <span>Shop</span>
          </Link>
          
          {isAuthenticated && (
            <>
              <Link to={getDashboardLink()} className="mobile-nav-link">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="mobile-nav-link">
                <User size={20} />
                <span>Profile</span>
              </Link>
            </>
          )}

          <div className="mobile-menu-divider" />

          {!isAuthenticated ? (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn btn-outline mobile-btn">Sign In</Link>
              <Link to="/register" className="btn btn-primary mobile-btn">Join Free</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="mobile-nav-link logout">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;