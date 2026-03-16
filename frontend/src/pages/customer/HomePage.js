import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Star, Truck, Shield, Clock, ChevronRight } from 'lucide-react';
import AdWidget from '../../components/AdWidget';
import Footer from '../../components/Footer';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data);
      const unique = ['All', ...new Set(res.data.map(p => p.category || 'General'))];
      setCategories(unique);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => (p.category || 'General') === activeCategory);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={14} 
          fill={i < rating ? '#FFB800' : 'none'}
          color={i < rating ? '#FFB800' : '#D1D5DB'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="home-page">
      {/* Mini Hero Section */}
      <div className="hero-mini">
        <div className="hero-mini-content">
          <h1 className="hero-mini-title">Quality Products at Your Fingertips</h1>
          <p className="hero-mini-subtitle">Shop from verified sellers with guaranteed quality</p>
        </div>
      </div>

      {/* Features Bar */}
      <div className="features-bar">
        <div className="features-container">
          <div className="feature-item">
            <Truck size={20} className="feature-icon" />
            <span>Free Shipping on ₹500+</span>
          </div>
          <div className="feature-divider"></div>
          <div className="feature-item">
            <Shield size={20} className="feature-icon" />
            <span>100% Secure Payments</span>
          </div>
          <div className="feature-divider"></div>
          <div className="feature-item">
            <Clock size={20} className="feature-icon" />
            <span>24/7 Customer Support</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Category Filters */}
        <div className="category-section">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {activeCategory === cat && <ChevronRight size={16} className="filter-icon" />}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-section">
          <div className="products-header">
            <h2 className="section-title">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h2>
            <span className="products-count">{filtered.length} items</span>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No Products Found</h3>
              <p>Try selecting a different category</p>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map(product => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />
                    
                    {product.availableQuantity > 0 && product.availableQuantity <= 5 && (
                      <div className="stock-badge stock-badge-low">
                        Only {product.availableQuantity} left
                      </div>
                    )}
                    
                    {product.availableQuantity === 0 && (
                      <div className="stock-badge stock-badge-out">Out of Stock</div>
                    )}

                    {product.discount && (
                      <div className="discount-badge">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <span className="product-category">{product.category || 'General'}</span>
                    <h3 className="product-name">{product.name}</h3>
                    
                    {product.rating && (
                      <div className="product-rating">
                        <div className="rating-stars">
                          {getRatingStars(product.rating)}
                        </div>
                        <span className="rating-count">({product.reviewCount || 0})</span>
                      </div>
                    )}

                    <div className="product-price-section">
                      <div className="price-container">
                        <span className="current-price">₹{product.price?.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      
                      {user?.role === 'CUSTOMER' && (
                        <button
                          className={`add-to-cart-btn ${product.availableQuantity === 0 ? 'disabled' : ''}`}
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.availableQuantity === 0}
                        >
                          <ShoppingBag size={18} />
                          <span>Add</span>
                        </button>
                      )}
                    </div>

                    {product.availableQuantity > 10 && (
                      <div className="in-stock-badge">In Stock</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ad Widget */}
      {user?.role === 'CUSTOMER' && (
        <div className="ad-widget-container">
          <AdWidget />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;