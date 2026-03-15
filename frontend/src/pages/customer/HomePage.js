import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag } from 'lucide-react';
import AdWidget from '../../components/AdWidget';
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

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Discover Quality Products</h1>
        <p className="hero-subtitle">Shop from verified sellers.</p>
      </div>
      <div className="container">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="loading-state">No products found.</div>
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
                  />
                  {product.availableQuantity > 0 && product.availableQuantity <= 5 && (
                    <div className="low-stock-badge">Low Stock</div>
                  )}
                  {product.availableQuantity === 0 && (
                    <div className="low-stock-badge" style={{ background: 'var(--color-danger)' }}>Out of Stock</div>
                  )}
                </div>
                <div className="product-info">
                  <span className="product-category">{product.category || 'General'}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    <span>₹{product.price?.toFixed(2)}</span>
                    {user?.role === 'CUSTOMER' && (
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.availableQuantity === 0}
                      >
                        <ShoppingBag size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {user?.role === 'CUSTOMER' && <AdWidget />}
    </div>
  );
};

export default HomePage;