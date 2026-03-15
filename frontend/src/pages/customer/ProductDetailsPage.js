import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Star, ArrowLeft, AlertCircle } from 'lucide-react';
import './ProductDetails.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/reviews/${id}`);
      setReviews(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reviews');
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.availableQuantity) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div className="container" style={{ padding: '4rem', color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div className="container product-details-container">
      <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back
      </button>
      <div className="product-details-grid">
        <div className="product-image-gallery">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
            alt={product.name}
            className="product-image-large"
          />
        </div>
        <div className="product-info-section">
          <div className="pd-category">{product.category || 'General'}</div>
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-price">₹{product.price?.toFixed(2)}</div>
          <div className="pd-description">
            {product.description || 'No description provided.'}
          </div>
          {product.availableQuantity > 0 ? (
            <div className={`stock-status ${product.availableQuantity <= 5 ? 'stock-low' : 'stock-in'}`}>
              <AlertCircle size={16} />
              {product.availableQuantity <= 5 ? `Only ${product.availableQuantity} left!` : 'In Stock'}
            </div>
          ) : (
            <div className="stock-status stock-out">
              <AlertCircle size={16} /> Out of Stock
            </div>
          )}
          <div className="pd-actions">
            <div className="quantity-selector">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q-1))} disabled={quantity <= 1}>-</button>
              <div className="qty-display">{quantity}</div>
              <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.availableQuantity, q+1))} disabled={quantity >= product.availableQuantity}>+</button>
            </div>
            {user?.role === 'CUSTOMER' && (
              <button className="btn btn-primary pd-add-to-cart" onClick={handleAddToCart} disabled={product.availableQuantity === 0}>
                <ShoppingCart size={20} /> {product.availableQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            )}
          </div>
          <div className="pd-meta">
            <div className="pd-meta-item">
              <span className="pd-meta-label">Seller</span>
              <span className="pd-meta-value">Verified</span>
            </div>
            {product.weight && (
              <div className="pd-meta-item">
                <span className="pd-meta-label">Weight</span>
                <span className="pd-meta-value">{product.weight} kg</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="reviews-section">
        <h2 className="reviews-header">Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-header">
                <span className="reviewer-name">{r.userName}</span>
                <span className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < r.rating ? 'currentColor' : 'none'} color={i < r.rating ? 'currentColor' : 'var(--color-border)'} />
                  ))}
                </span>
              </div>
              <p>{r.comment}</p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--color-text-secondary)', padding: '1rem' }}>No reviews yet.</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;