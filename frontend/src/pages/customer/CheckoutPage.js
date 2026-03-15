import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css';

const stripePromise = loadStripe('pk_test_YOUR_PUBLIC_KEY'); // replace with your Stripe public key

const StripeForm = ({ total, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    if (error) {
      onError(error.message);
      setProcessing(false);
    } else {
      onSuccess(paymentMethod.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-details">
      <div className="stripe-element-container">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: '1rem' }}
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        Your cart is empty.
      </div>
    );
  }

  const placeOrder = async (paymentMethod) => {
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod,
      };
      await axiosInstance.post(`/orders/${user.id}`, orderData);
      clearCart();
      navigate('/profile');
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to place order';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = () => placeOrder('COD');
  const handleStripeSuccess = (paymentId) => placeOrder('STRIPE');

  const total = getCartTotal();

  const checkAddress = (cb) => {
    if (!user?.address) {
      alert('Please set your delivery address in your profile before placing an order.');
      navigate('/profile');
      return false;
    }
    cb();
    return true;
  };

  return (
    <div className="container checkout-container">
      <h1 className="checkout-header">Checkout</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="checkout-grid">
        <div className="checkout-main">
          <div className="checkout-section">
            <h2>Shipping Information</h2>
            {user?.address ? (
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '4px' }}>
                {user.address}
              </div>
            ) : (
              <div style={{ color: 'var(--color-danger)' }}>
                Address missing.{' '}
                <button onClick={() => navigate('/profile')} className="btn btn-outline">
                  Set Address
                </button>
              </div>
            )}
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-method-options">
              <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div>
                  <strong>Cash on Delivery</strong>
                </div>
              </label>
              <label className={`payment-option ${paymentMethod === 'STRIPE' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="STRIPE"
                  checked={paymentMethod === 'STRIPE'}
                  onChange={() => setPaymentMethod('STRIPE')}
                />
                <div>
                  <strong>Credit Card (Stripe)</strong>
                </div>
              </label>
            </div>

            {paymentMethod === 'STRIPE' && (
              <Elements stripe={stripePromise}>
                <StripeForm
                  total={total}
                  onSuccess={() => checkAddress(handleStripeSuccess)}
                  onError={setError}
                />
              </Elements>
            )}

            {paymentMethod === 'COD' && (
              <button
                className="btn place-order-btn"
                onClick={() => checkAddress(handleCOD)}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
              </button>
            )}
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="checkout-section" style={{ position: 'sticky', top: '5rem' }}>
            <h2>Order Summary</h2>
            {cartItems.map(item => (
              <div key={item.productId} className="order-item-mini">
                <div className="item-mini-info">
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80'}
                    alt={item.productName}
                    className="item-mini-img"
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                  ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border)',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;