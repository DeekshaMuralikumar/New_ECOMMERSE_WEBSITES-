import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard } from 'lucide-react';
import './Cart.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => navigate('/checkout');

  if (loading && cartItems.length === 0) {
    return (
      <div className="container cart-container">
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div className="loader">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container cart-container">
        <div className="empty-cart-container">
          <div className="empty-cart-icon-wrapper">
            <ShoppingBag size={48} />
          </div>
          <h2 className="empty-cart-title">Your cart is empty</h2>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '2rem', padding: '1rem 2.5rem', borderRadius: 'var(--radius-full)' }}>
            Explore Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className="cart-header">
          <ShoppingBag size={32} />
          Shopping Cart
        </h1>
        <Link to="/products" className="continue-shopping-link desktop-only">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">
        <div className="cart-items-section">
          {cartItems.map((item, index) => (
            <div key={item.productId} className="cart-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="cart-item-img-wrapper">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'}
                  alt={item.productName}
                  className="cart-item-img"
                />
              </div>
              <div className="cart-item-info">
                <span className="cart-item-category">{item.categoryName || 'General'}</span>
                <h3 className="cart-item-title">{item.productName}</h3>
                <div className="cart-item-price-row">
                  <span className="cart-item-price">₹{item.priceAtPurchase.toFixed(2)}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>per unit</span>
                </div>
                {item.availableQuantity <= 5 && (
                  <div style={{ color: 'var(--color-warning)', fontSize: '0.85rem', fontWeight: '600', marginTop: '0.5rem' }}>
                    Only {item.availableQuantity} left!
                  </div>
                )}
              </div>
              <div className="cart-item-actions">
                <div className="cart-qty-controls">
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <div className="cart-qty-value">{item.quantity}</div>
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= (item.availableQuantity || 99)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button className="cart-remove-link" onClick={() => removeFromCart(item.productId)}>
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
          <Link to="/products" className="continue-shopping-link mobile-only" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <button className="btn checkout-btn" onClick={handleCheckout}>
            <CreditCard size={20} /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;